function blockSite() {
  document.documentElement.innerHTML = '';
  document.write(`
    <html><head><title>Site Blocked - Umar J Blocker</title></head>
    <body style="margin:0;padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;font-family:'Segoe UI',Arial;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="text-align:center;background:rgba(0,0,0,0.3);padding:40px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.3);">
        <div style="font-size:80px;margin-bottom:20px;">🚫</div>
        <h1 style="color:#ff4757;font-size:42px;margin:0 0 20px 0;font-weight:700;">SITE BLOCKED</h1>
        <p style="font-size:18px;margin:15px 0;opacity:0.9;">This website has been blocked for your productivity</p>
        <div style="background:rgba(255,255,255,0.1);padding:15px;border-radius:10px;margin:20px 0;">
          <p style="font-size:16px;margin:5px 0;opacity:0.8;">Blocked Site: <strong>${window.location.hostname}</strong></p>
          <p style="font-size:14px;margin:5px 0;opacity:0.6;">Time: ${new Date().toLocaleTimeString()}</p>
        </div>
        <div style="margin-top:30px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.2);">
          <p style="font-size:14px;margin:0;opacity:0.7;">Powered by <strong style="color:#ffa502;">Umar J Site Blocker</strong></p>
        </div>
      </div>
    </body></html>
  `);
  document.close();
  window.stop();
}

function checkBlocked() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    const hostname = window.location.hostname.replace(/^www\./i, '').toLowerCase();
    
    const blocked = sites.some(site => {
      const cleanSite = site.replace(/^www\./i, '').replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
      return hostname === cleanSite || hostname.endsWith('.' + cleanSite) || cleanSite.includes(hostname);
    });
    
    if (blocked) {
      blockSite();
      return true;
    }
    return false;
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