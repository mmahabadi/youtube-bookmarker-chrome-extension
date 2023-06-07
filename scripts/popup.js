const getActiveTab = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTab();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const activeTab = await getActiveTab();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    }
  );
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".svg";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const renderBookmarkForm = (bookmarksEl, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarksEl.appendChild(newBookmarkElement);
};

const renderBookmarks = (bookmarks = []) => {
  const bookmarksEl = document.getElementById("bookmarks");
  bookmarksEl.innerHTML = "";

  if (bookmarks.length) {
    const bookmarkEl = document.createElement("div");

    bookmarks.forEach((bookmark) => renderBookmarkForm(bookmarksEl, bookmark));
  } else {
    bookmarksEl.innerHTML = "No bookmarks yet";
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const tab = await getActiveTab();
  const queryParameters = tab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const videoId = urlParameters.get("v");

  if (tab.url.includes("youtube.com/watch") && videoId) {
    chrome.storage.sync.get([videoId], (data) => {
      const bookmarks = data[videoId] ? JSON.parse(data[videoId]) : [];
      renderBookmarks(bookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title">Please open a YouTube video to use this extension</div>';
  }
});
