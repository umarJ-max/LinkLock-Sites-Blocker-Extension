document.getElementById('add').onclick = function() {
  const site = document.getElementById('site').value;
  if (site) {
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      sites.push(site);
      chrome.storage.local.set({blockedSites: sites});
      showSites();
    });
    document.getElementById('site').value = '';
  }
};

function showSites() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    document.getElementById('sites').innerHTML = sites.map((s, i) => 
      `<div class="site-item">
        <span>${s}</span>
        <button class="remove-btn" onclick="removeSite(${i})">×</button>
      </div>`
    ).join('');
  });
}

function removeSite(index) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    sites.splice(index, 1);
    chrome.storage.local.set({blockedSites: sites});
    showSites();
  });
}

showSites();