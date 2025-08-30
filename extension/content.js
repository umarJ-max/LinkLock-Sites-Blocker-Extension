// Minimal content script - background handles blocking via declarativeNetRequest
// Only handles UI feedback and bypass detection

// Send page visit data to background for analytics
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', reportPageVisit);
} else {
  reportPageVisit();
}

function reportPageVisit() {
  const domain = window.location.hostname.replace('www.', '');
  chrome.runtime.sendMessage({
    type: 'PAGE_VISIT',
    domain: domain,
    url: window.location.href
  }).catch(() => {}); // Ignore errors if extension context is invalid
}