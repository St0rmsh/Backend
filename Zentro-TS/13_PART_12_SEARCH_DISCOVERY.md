# Zentro Frontend — PART 12 (Search & Discovery)

## Objective

Read completely before writing any code.

Required documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 11

Everything implemented previously must continue working.

Do NOT modify previous implementations unless fixing critical bugs.

This phase implements ONLY

- Search
- Search Suggestions
- Discover Page
- Trending Tags
- Search History
- Popular Searches

Do NOT implement

- AI Recommendations
- Messaging
- Admin
- Reading Analytics

---

# Goal

Build a modern search experience inspired by

Instagram

Threads

Twitter (X)

GitHub

Notion

Linear

The experience must feel instant and highly interactive.

---

# Backend APIs

Integrate every available search endpoint.

Examples

GET

/search

GET

/search/users

GET

/search/posts

GET

/search/tags

Search the Search.routes.ts file to get the correct url and app.ts file to get the final url.

If backend endpoints differ, adapt without changing architecture.

---

# Folder Structure

Create

features/

    search/

        components/

        pages/

        services/

        state/

Follow the strict 4-layer architecture.

---

# Redux

Create

Search Slice

Recent Search Slice

Trending Slice

Support

Search Query

Loading

Pagination

Results

Filters

Errors

Caching

Recent Searches

Popular Searches

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

Create

search.service.ts

No API logic inside components.

---

# Search Page

Create a dedicated Search page.

Support

Search Input

Search Suggestions

Tabs

Users

Posts

Tags

Infinite Scroll

Loading

Empty State

Error State

---

# Global Search

Use the global command palette from Part 04.

Support

Ctrl + K

⌘ + K

Search opens instantly.

Debounced search.

Keyboard navigation.

---

# Search Suggestions

Show suggestions while typing.

Support

Recent Searches

Trending Searches

Popular Tags

Popular Users

Popular Posts

---

# Recent Searches

Save recent searches.

Support

Pin

Remove

Clear All

Maximum history limit.

Persist using local storage helper (not authentication).

---

# Trending Tags

Create reusable Trending Tags section.

Display

Tag

Usage Count

Trending Indicator

Click to Search

---

# Discover Page

Create Discover page.

Display

Trending Blogs

Trending Authors

Popular Tags

Recently Published

Most Liked

Newest

Architecture must be reusable.

---

# Search Cards

Create reusable cards.

User Card

Post Card

Tag Card

Each card should have

Hover Animation

Loading Skeleton

Responsive Layout

Consistent Design

---

# Filters

Support

All

Users

Posts

Tags

Newest

Popular

Most Liked

Most Commented

Future-ready architecture.

---

# Pagination

Support

Infinite Scroll

Load More

Caching

Prevent duplicate requests.

---

# Components

Create reusable

SearchBar

SearchInput

SearchResultList

SearchCard

SearchSkeleton

SearchEmptyState

SearchErrorState

TrendingTags

RecentSearches

PopularSearches

SearchFilters

DiscoverGrid

---

# Animations

Use Framer Motion.

Animate

Search Results

Suggestions

Dropdown

Cards

Hover

Page Transition

Keep animations subtle.

---

# Accessibility

Support

Keyboard Navigation

Arrow Keys

Enter Selection

Escape Close

ARIA Labels

Screen Readers

Reduced Motion

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Perfect responsiveness.

---

# Performance

Debounce search input.

Cache recent queries.

Memoize search results.

Lazy load result sections.

Avoid unnecessary rerenders.

---

# Future Compatibility

Architecture must easily support

AI Search

Semantic Search

Voice Search

Image Search

Recommended Searches

Without refactoring.

---

# Final Verification

Verify at least 3–4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicated search logic

✓ Debounced search works

✓ Infinite scrolling works

✓ Recent searches work

✓ Trending tags work

✓ Responsive UI

✓ Consistent design

✓ No unnecessary API calls

Stop after the Search & Discovery system is completely finished.

Do NOT implement AI Recommendations, Messaging, Reading Analytics, or Admin.