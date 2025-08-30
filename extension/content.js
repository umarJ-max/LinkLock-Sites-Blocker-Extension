function blockSite() {
  document.documentElement.innerHTML = '';
  document.write(`
    <html><head><title>Site Blocked</title></head>
    <body style="margin:0;padding:0;background:#000;color:#fff;font-family:Arial;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="text-align:center;">
        <h1 style="color:red;font-size:48px;margin:0;">🚫 SITE BLOCKED</h1>
        <p style="font-size:20px;margin:20px 0;">This website has been blocked</p>
        <p style="font-size:16px;opacity:0.7;">${window.location.hostname}</p>
      </div>
    </body></html>
  `);
  document.close();
  window.stop();
}

function checkBlocked() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    const hostname = window.location.hostname;
    
    const blocked = sites.some(site => {
      return hostname.includes(site) || hostname === site || hostname.endsWith('.' + site);
    });
    
    if (blocked) {
      blockSite();
    }
  });
}

checkBlocked();

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    checkBlocked();
  }
}).observe(document, {subtree: true, childList: true});