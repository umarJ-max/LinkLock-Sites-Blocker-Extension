document.addEventListener('DOMContentLoaded', async () => {
  const statusCard = document.getElementById('statusCard');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const toggleBtn = document.getElementById('toggleBtn');
  const dashboardBtn = document.getElementById('dashboardBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const clearBtn = document.getElementById('clearBtn');
  const siteInput = document.getElementById('siteInput');
  const blockedCount = document.getElementById('blockedCount');
  const blockedToday = document.getElementById('blockedToday');
  
  let isPaused = false;
  
  // Load initial data
  await loadData();
  
  // Event listeners
  toggleBtn.addEventListener('click', toggleBlocking);
  dashboardBtn.addEventListener('click', openDashboard);
  pauseBtn.addEventListener('click', pauseBlocking);
  clearBtn.addEventListener('click', clearAllSites);
  siteInput.addEventListener('keypress', handleSiteInput);
  
  async function loadData() {
    const data = await chrome.storage.local.get([
      'isBlocking', 'blockedSites', 'blockedToday', 'pausedUntil'
    ]);
    
    const isBlocking = data.isBlocking || false;
    const sites = data.blockedSites || [];
    const todayCount = data.blockedToday || 0;
    const pausedUntil = data.pausedUntil || 0;
    
    isPaused = Date.now() < pausedUntil;
    
    updateUI(isBlocking && !isPaused, sites.length, todayCount);
  }
  
  async function toggleBlocking() {
    const { isBlocking = false } = await chrome.storage.local.get(['isBlocking']);
    const newStatus = !isBlocking;
    
    await chrome.storage.local.set({ 
      isBlocking: newStatus,
      pausedUntil: 0 // Clear any pause
    });
    
    isPaused = false;
    const { blockedSites = [] } = await chrome.storage.local.get(['blockedSites']);
    updateUI(newStatus, blockedSites.length);
  }
  
  async function pauseBlocking() {
    const pauseUntil = Date.now() + (5 * 60 * 1000); // 5 minutes
    await chrome.storage.local.set({ pausedUntil: pauseUntil });
    
    isPaused = true;
    const { blockedSites = [] } = await chrome.storage.local.get(['blockedSites']);
    updateUI(false, blockedSites.length);
    
    // Update button text
    pauseBtn.textContent = 'Paused';
    setTimeout(() => {
      pauseBtn.textContent = 'Pause 5min';
      loadData(); // Refresh status
    }, 5 * 60 * 1000);
  }
  
  async function clearAllSites() {
    if (confirm('Clear all blocked sites?')) {
      await chrome.storage.local.set({ 
        blockedSites: [],
        blockedToday: 0
      });
      updateUI(false, 0, 0);
    }
  }
  
  async function handleSiteInput(e) {
    if (e.key === 'Enter' && siteInput.value.trim()) {
      const site = siteInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      const { blockedSites = [] } = await chrome.storage.local.get(['blockedSites']);
      
      if (!blockedSites.includes(site)) {
        blockedSites.push(site);
        await chrome.storage.local.set({ blockedSites });
        
        siteInput.value = '';
        blockedCount.textContent = blockedSites.length;
      }
    }
  }
  
  function openDashboard() {
    chrome.tabs.create({ 
      url: chrome.runtime.getURL('../index.html') || 'https://webguard-dashboard.vercel.app'
    });
  }
  
  function updateUI(isActive, siteCount = 0, todayCount = 0) {
    // Update status
    if (isPaused) {
      statusCard.className = 'status-card inactive';
      statusIndicator.className = 'status-indicator inactive';
      statusText.textContent = 'Paused (5 min)';
      toggleBtn.textContent = 'Resume Blocking';
      toggleBtn.className = 'btn btn-toggle';
    } else if (isActive) {
      statusCard.className = 'status-card active';
      statusIndicator.className = 'status-indicator active';
      statusText.textContent = 'Active & Blocking';
      toggleBtn.textContent = 'Stop Blocking';
      toggleBtn.className = 'btn btn-toggle active';
    } else {
      statusCard.className = 'status-card inactive';
      statusIndicator.className = 'status-indicator inactive';
      statusText.textContent = 'Inactive';
      toggleBtn.textContent = 'Start Blocking';
      toggleBtn.className = 'btn btn-toggle';
    }
    
    // Update counts
    blockedCount.textContent = siteCount;
    blockedToday.textContent = todayCount;
  }
});