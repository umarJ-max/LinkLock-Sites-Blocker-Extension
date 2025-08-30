// Check if current site should be blocked
chrome.storage.local.get(['blockedSites'], (result) => {
  const sites = result.blockedSites || [];
  const hostname = window.location.hostname;
  
  const blocked = sites.some(site => hostname.includes(site));
  
  if (blocked) {
    document.body.innerHTML = '<h1 style="text-align:center;margin-top:200px;color:red;">SITE BLOCKED</h1>';
  }
});