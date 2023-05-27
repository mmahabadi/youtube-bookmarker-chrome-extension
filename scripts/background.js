chrome.tabs.onUpdated.addListener((tabId, cur, tab) => {
    const { url } = tab;
    if (url && url.includes("youtube.com/watch")) {
      const queryParameters = url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const videoId = urlParameters.get("v");

      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId,
      });
    }
});
