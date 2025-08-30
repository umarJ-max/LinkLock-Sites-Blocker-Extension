// Popup script for WebGuard extension
document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const toggleBtn = document.getElementById('toggle');
  const dashboardBtn = document.getElementById('dashboard');
  
  // Load current status
  const { isBlocking = false } = await chrome.storage.local.get(['isBlocking']);
  updateUI(isBlocking);
  
  // Toggle blocking
  toggleBtn.addEventListener('click', async () => {
    const { isBlocking: currentStatus = false } = await chrome.storage.local.get(['isBlocking']);
    const newStatus = !currentStatus;
    
    await chrome.storage.local.set({ isBlocking: newStatus });
    updateUI(newStatus);
  });
  
  // Open dashboard
  dashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://your-vercel-url.vercel.app' });
  });
  
  function updateUI(isActive) {
    if (isActive) {
      statusEl.textContent = 'Active';
      statusEl.className = 'active';
      toggleBtn.textContent = 'Stop Blocking';
    } else {
      statusEl.textContent = 'Inactive';
      statusEl.className = 'inactive';
      toggleBtn.textContent = 'Start Blocking';
    }
  }
});