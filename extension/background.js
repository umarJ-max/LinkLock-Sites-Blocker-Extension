let blockedSites = [];
let isBlocking = false;
let pausedUntil = 0;
let blockedToday = 0;
let lastResetDate = new Date().toDateString();

// Initialize on startup
chrome.runtime.onStartup.addListener(loadData);
chrome.runtime.onInstalled.addListener(loadData);

function loadData() {
  chrome.storage.local.get([
    'blockedSites', 'isBlocking', 'pausedUntil', 'blockedToday', 'lastResetDate'
  ], (result) => {
    blockedSites = result.blockedSites || [];
    isBlocking = result.isBlocking || false;
    pausedUntil = result.pausedUntil || 0;
    blockedToday = result.blockedToday || 0;
    lastResetDate = result.lastResetDate || new Date().toDateString();
    
    // Reset daily count if new day
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      blockedToday = 0;
      chrome.storage.local.set({ 
        blockedToday: 0, 
        lastResetDate: today 
      });
    }
    
    updateBlockingRules();
  });
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
  }
  if (changes.isBlocking) {
    isBlocking = changes.isBlocking.newValue || false;
  }
  if (changes.pausedUntil) {
    pausedUntil = changes.pausedUntil.newValue || 0;
  }
  updateBlockingRules();
});

// Check if currently paused
function isPaused() {
  return Date.now() < pausedUntil;
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_VISIT') {
    // Track page visits for analytics
    const domain = message.domain;
    if (isBlocking && !isPaused() && blockedSites.some(site => domain.includes(site) || site.includes(domain))) {
      blockedToday++;
      chrome.storage.local.set({ blockedToday });
    }
  }
});

// Generate blocked page HTML
function getBlockedPageHTML(domain) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Site Blocked - WebGuard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          margin: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          background: rgba(0,0,0,0.2);
          padding: 3rem;
          border-radius: 20px;
          max-width: 500px;
        }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { font-size: 2.5rem; margin: 1rem 0; }
        p { font-size: 1.2rem; margin: 1rem 0; }
        .domain { font-size: 1rem; opacity: 0.8; }
        button {
          margin-top: 2rem;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🚫</div>
        <h1>Website Blocked</h1>
        <p>This website has been blocked by WebGuard</p>
        <div class="domain">Domain: ${domain}</div>
        <button onclick="history.back()">Go Back</button>
      </div>
    </body>
    </html>
  `;
}

// Update blocking rules using declarativeNetRequest
function updateBlockingRules() {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds });
    }
  });
  
  if (isBlocking && !isPaused() && blockedSites.length > 0) {
    const rules = blockedSites.slice(0, 50).map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { 
        type: 'redirect',
        redirect: { url: `data:text/html,${encodeURIComponent(getBlockedPageHTML(site))}` }
      },
      condition: {
        urlFilter: `*://*.${site}/*`,
        resourceTypes: ['main_frame']
      }
    }));
    
    chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
  }
}

loadData();