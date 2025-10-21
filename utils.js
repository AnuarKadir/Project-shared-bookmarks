// Shows the date in a nice UK style (e.g., “20 October 2025, 10:05”)
export function formatTimestamp(isoString) {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-GB", options);
}

// Sort bookmarks by date in reverse chronological order (newest first)
export function sortBookmarksByDate(bookmarks) {
  if (!Array.isArray(bookmarks)) {
    return [];
  }

  return [...bookmarks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // Descending order (newest first)
  });
}
