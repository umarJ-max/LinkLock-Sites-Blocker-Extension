// Simple background script for WebGuard
let blockedCount = 0;

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['blockedSites', 'isBlocking', 'blockedCount'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.local.set({ blockedSites: [] });
    }
    if (result.isBlocking === undefined) {
      chrome.storage.local.set({ isBlocking: false });
    }
    blockedCount = result.blockedCount || 0;
  });
});

// Track blocked attempts from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'siteBlocked') {
    blockedCount++;
    chrome.storage.local.set({ blockedCount });
  }
});