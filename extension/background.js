let blockedSites = [];
let isBlocking = false;
let blockedToday = 0;

// Initialize immediately
loadData();
chrome.runtime.onStartup.addListener(loadData);
chrome.runtime.onInstalled.addListener(loadData);

function loadData() {
  chrome.storage.local.get(['blockedSites', 'isBlocking', 'blockedToday'], (result) => {
    blockedSites = result.blockedSites || [];
    isBlocking = result.isBlocking || false;
    blockedToday = result.blockedToday || 0;
    updateBlockingRules();
  });
}

// Listen for storage changes and update rules immediately
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) blockedSites = changes.blockedSites.newValue || [];
  if (changes.isBlocking) isBlocking = changes.isBlocking.newValue || false;
  if (changes.blockedToday) blockedToday = changes.blockedToday.newValue || 0;
  updateBlockingRules();
});

// Block requests using declarativeNetRequest
function updateBlockingRules() {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds });
    }
    
    if (isBlocking && blockedSites.length > 0) {
      const rules = [];
      blockedSites.forEach((site, index) => {
        rules.push({
          id: index + 1,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: `*://*.${site}/*`,
            resourceTypes: ['main_frame', 'sub_frame']
          }
        });
      });
      
      chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
    }
  });
}

// Handle blocked requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isBlocking) return;
    
    const url = new URL(details.url);
    const domain = url.hostname.replace('www.', '');
    
    if (blockedSites.some(site => domain.includes(site) || site.includes(domain))) {
      blockedToday++;
      chrome.storage.local.set({ blockedToday });
      return { cancel: true };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);