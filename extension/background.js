// Background service worker for WebGuard
chrome.runtime.onInstalled.addListener(() => {
  console.log('WebGuard extension installed');
  updateBlockingRules();
});

// Listen for storage changes from dashboard
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites || changes.isBlocking) {
    updateBlockingRules();
  }
});

// Update declarative net request rules
async function updateBlockingRules() {
  const { blockedSites = [], isBlocking = false } = await chrome.storage.local.get(['blockedSites', 'isBlocking']);
  
  if (!isBlocking || blockedSites.length === 0) {
    // Clear all rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1)
    });
    return;
  }

  // Create blocking rules
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `*://*.${site}/*`,
      resourceTypes: ['main_frame', 'sub_frame']
    }
  }));

  // Update rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1),
    addRules: rules
  });
}

// Sync with dashboard
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('webguard')) {
    // Inject connection script to sync with dashboard
    chrome.tabs.sendMessage(tabId, { type: 'EXTENSION_CONNECTED' });
  }
});