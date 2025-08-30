let blockedSites = [];
let isBlocking = false;
let blockedCount = 0;

// Initialize
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

function init() {
  chrome.storage.local.get(['blockedSites', 'isBlocking'], (result) => {
    blockedSites = result.blockedSites || [];
    isBlocking = result.isBlocking || false;
    updateRules();
  });
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
    updateRules();
  }
  if (changes.isBlocking) {
    isBlocking = changes.isBlocking.newValue || false;
    updateRules();
  }
});

// Block using declarativeNetRequest
function updateRules() {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }
    
    if (isBlocking && blockedSites.length > 0) {
      const rules = [];
      blockedSites.forEach((site, index) => {
        // Block main domain
        rules.push({
          id: index * 3 + 1,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: `*://${site}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Block www subdomain
        rules.push({
          id: index * 3 + 2,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: `*://www.${site}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Block all subdomains
        rules.push({
          id: index * 3 + 3,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: `*://*.${site}/*`,
            resourceTypes: ['main_frame']
          }
        });
      });
      
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      });
    }
  });
}

// Backup blocking using webRequest
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isBlocking || !details.url) return;
    
    try {
      const url = new URL(details.url);
      const hostname = url.hostname.replace('www.', '');
      
      const isBlocked = blockedSites.some(site => 
        hostname === site || 
        hostname.endsWith('.' + site) ||
        site.includes(hostname)
      );
      
      if (isBlocked) {
        blockedCount++;
        chrome.storage.local.set({ blockedCount });
        return { cancel: true };
      }
    } catch (e) {
      // Invalid URL, ignore
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Initialize on load
init();