import { getUserIds, getData, setData } from "./storage.js";
import { formatTimestamp, sortBookmarksByDate } from "./utils.js";

// Currently selected user
let currentUser = "";

// Initialize the app
function init() {
  populateUserDropdown();
  setupEventListeners();
}

// Populate the user dropdown with user IDs
function populateUserDropdown() {
  const userSelect = document.getElementById("user-dropdown");
  const userIds = getUserIds();

  userIds.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = userId;
    userSelect.appendChild(option);
  });
}

// Set up event listeners
function setupEventListeners() {
  const userSelect = document.getElementById("user-dropdown");
  const bookmarkForm = document.getElementById("bookmark-form");

  userSelect.addEventListener("change", handleUserChange);
  bookmarkForm.addEventListener("submit", handleBookmarkSubmit);
}

// Handle user selection change
function handleUserChange(event) {
  currentUser = event.target.value;

  if (currentUser) {
    displayBookmarks(currentUser);
  } else {
    document.getElementById("bookmarks-list").innerHTML = "";
  }
}

// Display bookmarks for the selected user
export function displayBookmarks(userId) {
  const bookmarksList = document.getElementById("bookmarks-list");
  const bookmarks = getData(userId);

  if (!bookmarks || bookmarks.length === 0) {
    bookmarksList.innerHTML =
      "<p>No bookmarks yet. Add your first bookmark below!</p>";
    return;
  }

  const sortedBookmarks = sortBookmarksByDate(bookmarks);

  bookmarksList.innerHTML = sortedBookmarks
    .map((bookmark) => {
      return `
            <article>
                <h3><a href="${bookmark.url}"
                 target="_blank" rel="noopener noreferrer">${
                   bookmark.title
                 }</a></h3>
                <p>${bookmark.description}</p>
                <time datetime="${bookmark.createdAt}">${formatTimestamp(
        bookmark.createdAt
      )}</time>
            </article>
            <hr>
        `;
    })
    .join("");
}

// Handle bookmark form submission
function handleBookmarkSubmit(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please select a user first");
    return;
  }

  const form = event.target;
  const url = form.url.value.trim();
  const title = form.title.value.trim();
  const description = form.description.value.trim();

  if (!url || !title || !description) {
    alert("Please fill in all fields");
    return;
  }

  addBookmark(currentUser, url, title, description);
  form.reset();
  displayBookmarks(currentUser);
}

// Add a new bookmark for the user
export function addBookmark(userId, url, title, description) {
  const existingBookmarks = getData(userId) || [];

  const newBookmark = {
    url: url,
    title: title,
    description: description,
    createdAt: new Date().toISOString(),
  };

  const updatedBookmarks = [...existingBookmarks, newBookmark];
  setData(userId, updatedBookmarks);
}

// Start the app when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { handleUserChange, handleBookmarkSubmit };
