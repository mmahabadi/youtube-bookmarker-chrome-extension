chrome.tabs.onUpdated.addListener((tabId, cur, tab) => {
  const { status } = cur;
  const { url } = tab;
  if (status == "complete" && url && url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(tabId, "this is youtube...");
  }
});
