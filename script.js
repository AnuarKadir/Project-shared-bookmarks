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

function handleUserChange(e) {
  currentUser = e.target.value;
  if (currentUser) {
    displayBookmarks(currentUser);
  } else {
    showSelectUserMessage();
  }
}

function showSelectUserMessage() {
  const list = document.getElementById("bookmarks-list");
  list.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = "Please select a user from the dropdown above.";
  list.appendChild(p);
}

// Display bookmarks for the selected user
export function displayBookmarks(userId) {
  const container = document.getElementById("bookmarks-list");
  const bookmarks = getData(userId) || [];

  // Clear existing content
  container.innerHTML = "";

  // Show message if no bookmarks
  if (bookmarks.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No bookmarks yet. Add your first bookmark below!";
    container.appendChild(p);
    return;
  }

  const sorted = sortBookmarksByDate(bookmarks);

  // Render each bookmark
  for (const b of sorted) {
    const article = document.createElement("article");

    const h3 = document.createElement("h3");
    const a = document.createElement("a");
    a.href = b.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = b.title;
    h3.appendChild(a);

    const p = document.createElement("p");
    p.textContent = b.description;

    const time = document.createElement("time");
    time.setAttribute("datetime", b.createdAt);
    time.textContent = formatTimestamp(b.createdAt);

    article.append(h3, p, time);
    container.appendChild(article);

    // Add horizontal rule between bookmarks
    container.appendChild(document.createElement("hr"));
  }
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
