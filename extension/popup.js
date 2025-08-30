function extractDomain(input) {
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return new URL(input).hostname.replace(/^www\./i, '');
    }
    return input.replace(/^www\./i, '').replace(/^https?:\/\//i, '').split('/')[0];
  } catch {
    return input.replace(/^www\./i, '');
  }
}

document.getElementById('add').onclick = function() {
  const input = document.getElementById('site').value.trim();
  if (input) {
    const domain = extractDomain(input);
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      if (!sites.includes(domain)) {
        sites.push(domain);
        chrome.storage.local.set({blockedSites: sites});
        showSites();
      }
    });
    document.getElementById('site').value = '';
  }
};

document.getElementById('blockCurrent').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const domain = extractDomain(tabs[0].url);
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      if (!sites.includes(domain)) {
        sites.push(domain);
        chrome.storage.local.set({blockedSites: sites});
        showSites();
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
};

function showSites() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    document.getElementById('sites').innerHTML = sites.map((s, i) => 
      `<div class="site-item">
        <span>${s}</span>
        <button class="remove-btn" data-index="${i}">×</button>
      </div>`
    ).join('');
    document.getElementById('count').textContent = sites.length;
  });
}

document.getElementById('sites').onclick = function(e) {
  if (e.target.classList.contains('remove-btn')) {
    const index = parseInt(e.target.dataset.index);
    chrome.storage.local.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      sites.splice(index, 1);
      chrome.storage.local.set({blockedSites: sites});
      showSites();
    });
  }
}

showSites();