(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    console.log("response:", obj);
  });
})();
