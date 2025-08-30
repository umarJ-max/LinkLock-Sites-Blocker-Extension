document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const toggleBtn = document.getElementById('toggleBtn');
  const siteInput = document.getElementById('siteInput');
  const sitesList = document.getElementById('sitesList');
  const clearBtn = document.getElementById('clearBtn');
  
  // Load current state
  loadState();
  
  // Event listeners
  toggleBtn.addEventListener('click', toggleBlocking);
  siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSite();
  });
  clearBtn.addEventListener('click', clearSites);
  
  function loadState() {
    chrome.storage.local.get(['isBlocking', 'blockedSites'], (result) => {
      const isBlocking = result.isBlocking || false;
      const sites = result.blockedSites || [];
      
      updateUI(isBlocking);
      displaySites(sites);
    });
  }
  
  function toggleBlocking() {
    chrome.storage.local.get(['isBlocking'], (result) => {
      const newState = !result.isBlocking;
      chrome.storage.local.set({ isBlocking: newState });
      updateUI(newState);
    });
  }
  
  function addSite() {
    const site = siteInput.value.trim().toLowerCase();
    if (!site) return;
    
    // Clean the site URL
    const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      if (!sites.includes(cleanSite)) {
        sites.push(cleanSite);
        chrome.storage.local.set({ blockedSites: sites });
        displaySites(sites);
      }
      siteInput.value = '';
    });
  }
  
  function removeSite(site) {
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      const newSites = sites.filter(s => s !== site);
      chrome.storage.local.set({ blockedSites: newSites });
      displaySites(newSites);
    });
  }
  
  function clearSites() {
    chrome.storage.local.set({ blockedSites: [] });
    displaySites([]);
  }
  
  function updateUI(isBlocking) {
    if (isBlocking) {
      status.className = 'status active';
      status.textContent = 'Blocking: ON';
      toggleBtn.textContent = 'Stop Blocking';
      toggleBtn.className = 'toggle active';
    } else {
      status.className = 'status inactive';
      status.textContent = 'Blocking: OFF';
      toggleBtn.textContent = 'Start Blocking';
      toggleBtn.className = 'toggle';
    }
  }
  
  function displaySites(sites) {
    sitesList.innerHTML = '';
    sites.forEach(site => {
      const div = document.createElement('div');
      div.className = 'site';
      div.innerHTML = `
        <span>${site}</span>
        <button class="remove" onclick="removeSite('${site}')">×</button>
      `;
      sitesList.appendChild(div);
    });
  }
  
  // Make removeSite available globally
  window.removeSite = removeSite;
});