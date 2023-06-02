import { getActiveTab } from "./util.js";

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

const renderBookmarks = (bookmarks = []) => {
  debugger;
  const bookmarksEl = document.getElementById("bookmarks");
  bookmarksEl.innerHTML = "";

  if (bookmarks.length) {
    const bookmarkEl = document.createElement("div");

    bookmarks.forEach((bookmark) => renderBookmarkForm(bookmarksEl, bookmark));
  } else {
    bookmarksEl.innerHTML = "No bookmarks yet";
  }
};

const renderBookmarkForm = (bookmarksEl, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarksEl.appendChild(newBookmarkElement);
};
