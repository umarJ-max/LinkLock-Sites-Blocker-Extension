// Simple but effective site blocker
(function() {
  let isBlocking = false;
  let blockedSites = [];
  
  function checkAndBlock() {
    if (!isBlocking) return;
    
    const hostname = window.location.hostname.replace('www.', '');
    const isBlocked = blockedSites.some(site => 
      hostname === site || hostname.includes(site) || site.includes(hostname)
    );
    
    if (isBlocked) {
      // Stop page loading
      window.stop();
      
      // Replace page content
      document.documentElement.innerHTML = `
        <html><head><title>Site Blocked</title></head>
        <body style="margin:0;font-family:Arial;background:#dc3545;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
          <div style="text-align:center;padding:2rem;background:rgba(0,0,0,0.2);border-radius:10px;">
            <h1 style="font-size:3rem;margin:0 0 1rem 0;">🚫 BLOCKED</h1>
            <p style="font-size:1.2rem;margin:0.5rem 0;">This site is blocked</p>
            <p style="font-size:1rem;opacity:0.8;">${hostname}</p>
            <button onclick="history.back()" style="margin-top:1rem;padding:0.5rem 1rem;background:rgba(255,255,255,0.2);border:none;color:white;border-radius:5px;cursor:pointer;">Go Back</button>
          </div>
        </body></html>
      `;
      
      // Send message to background
      try {
        chrome.runtime.sendMessage({ action: 'siteBlocked' });
      } catch(e) {}
    }
  }
  
  // Load settings
  chrome.storage.local.get(['isBlocking', 'blockedSites'], (result) => {
    isBlocking = result.isBlocking || false;
    blockedSites = result.blockedSites || [];
    checkAndBlock();
  });
  
  // Listen for changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isBlocking) {
      isBlocking = changes.isBlocking.newValue || false;
    }
    if (changes.blockedSites) {
      blockedSites = changes.blockedSites.newValue || [];
    }
    checkAndBlock();
  });
  
})();