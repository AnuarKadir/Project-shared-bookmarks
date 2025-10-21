import { sortBookmarksByDate } from "./utils.js";
import { strict as assert } from "node:assert";
import { test } from "node:test";

test("sortBookmarksByDate sorts bookmarks in reverse chronological order (newest first)", () => {
  const bookmarks = [
    { title: "First", createdAt: "2024-01-01T10:00:00Z" },
    { title: "Third", createdAt: "2024-01-03T10:00:00Z" },
    { title: "Second", createdAt: "2024-01-02T10:00:00Z" },
  ];

  const sorted = sortBookmarksByDate(bookmarks);

  // Newest should be first
  assert.equal(sorted[0].title, "Third");
  assert.equal(sorted[1].title, "Second");
  assert.equal(sorted[2].title, "First");

  // Should have all items
  assert.equal(sorted.length, 3);
});
