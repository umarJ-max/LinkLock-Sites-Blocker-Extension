// Ultra-strong DOM-level content blocker
(function() {
  'use strict';
  
  let isBlocking = false;
  let blockedSites = [];
  let blocked = false;
  
  // Immediate blocking check
  function isCurrentSiteBlocked() {
    const hostname = window.location.hostname.replace('www.', '');
    return blockedSites.some(site => 
      hostname === site || 
      hostname.endsWith('.' + site) ||
      site.includes(hostname)
    );
  }
  
  // Nuclear block - completely replace page
  function executeBlock() {
    if (blocked) return;
    blocked = true;
    
    // Notify background script
    chrome.runtime.sendMessage({ action: 'siteBlocked' });
    
    // Stop all loading immediately
    if (window.stop) window.stop();
    
    // Clear everything
    document.documentElement.innerHTML = '';
    
    // Inject block page
    const blockHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Blocked</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#e74c3c,#c0392b);color:white;display:flex;align-items:center;justify-content:center;height:100vh}.container{text-align:center;background:rgba(0,0,0,0.3);padding:2rem;border-radius:15px}h1{font-size:3rem;margin:0 0 1rem 0}p{font-size:1.2rem;margin:0.5rem 0}button{background:rgba(255,255,255,0.2);border:none;color:white;padding:1rem 2rem;border-radius:8px;cursor:pointer;font-size:1rem;margin-top:1rem}</style></head><body><div class="container"><h1>🚫 BLOCKED</h1><p>This website is blocked by WebGuard</p><p><strong>${window.location.hostname}</strong></p><button onclick="history.back()">Go Back</button></div></body></html>`;
    
    document.open();
    document.write(blockHTML);
    document.close();
    
    // Prevent any DOM manipulation
    Object.defineProperty(document, 'body', { writable: false });
    Object.defineProperty(document, 'head', { writable: false });
  }
  
  // Multi-layer blocking system
  function initializeBlocking() {
    if (!isBlocking || !isCurrentSiteBlocked()) return;
    
    executeBlock();
    
    // Block all network requests
    const originalFetch = window.fetch;
    window.fetch = () => Promise.reject(new Error('Blocked'));
    
    // Block XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      throw new Error('Blocked');
    };
    
    // Block dynamic script loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tag) {
      if (tag.toLowerCase() === 'script' || tag.toLowerCase() === 'iframe') {
        throw new Error('Blocked');
      }
      return originalCreateElement.call(this, tag);
    };
    
    // Block navigation attempts
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      return false;
    });
  }
  
  // Get settings and initialize
  chrome.storage.local.get(['isBlocking', 'blockedSites'], (result) => {
    isBlocking = result.isBlocking || false;
    blockedSites = result.blockedSites || [];
    initializeBlocking();
  });
  
  // Listen for setting changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isBlocking) isBlocking = changes.isBlocking.newValue || false;
    if (changes.blockedSites) blockedSites = changes.blockedSites.newValue || [];
    initializeBlocking();
  });
  
  // Continuous monitoring
  const observer = new MutationObserver(() => {
    if (isBlocking && isCurrentSiteBlocked() && !blocked) {
      executeBlock();
    }
  });
  
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
})();