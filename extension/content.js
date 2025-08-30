// Content script for WebGuard dashboard integration
if (window.location.hostname.includes('webguard') || window.location.hostname.includes('vercel')) {
  // Override the simulateBlocking function to use real extension API
  window.addEventListener('load', () => {
    if (typeof window.saveData === 'function') {
      const originalSaveData = window.saveData;
      window.saveData = function() {
        originalSaveData();
        // Sync with extension storage
        chrome.storage.local.set({
          blockedSites: window.blockedSites || [],
          isBlocking: window.isBlocking || false
        });
      };
    }
    
    // Load data from extension storage
    chrome.storage.local.get(['blockedSites', 'isBlocking'], (result) => {
      if (result.blockedSites) {
        window.blockedSites = result.blockedSites;
      }
      if (result.isBlocking !== undefined) {
        window.isBlocking = result.isBlocking;
      }
      if (typeof window.updateUI === 'function') {
        window.updateUI();
      }
    });
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTENSION_CONNECTED') {
    console.log('WebGuard extension connected to dashboard');
  }
});