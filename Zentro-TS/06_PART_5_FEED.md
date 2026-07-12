# Zentro Frontend — PART 5 (Home Feed)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md
- 03_PART_2_AUTH_UI.md
- 04_PART_3_NAVIGATION_LAYOUT.md
- 05_PART_4_PROFILE_SETTINGS.md

Everything implemented previously must remain untouched unless fixing bugs.

This phase builds ONLY the Home Feed.


Do NOT implement:

- Comments
- Likes
- Bookmarks
- Follow
- Notifications
- Search
- Admin

Only prepare placeholders where necessary.

---

# Goal

Build an Instagram + Threads + Medium inspired feed.

The feed should maximize reading time.

Everything should be production-ready.

---

# Backend APIs

Use existing backend feed APIs.

If pagination already exists, use it.

Support:

Infinite Pagination

Cursor Pagination (future-ready)

Skeleton Loading

Refresh Feed

Retry

---


# Folder Structure

Create:

features/feed/

    components/

    pages/

    services/

    state/

Follow the 4-layer architecture.

---



# Feed Page

Create:

Home Feed Page

Trending Feed (placeholder)

Following Feed (placeholder)

Recommended Feed (placeholder)

Do NOT duplicate layouts.

---



# Feed Layout

Desktop

Sidebar

Feed

Right Sidebar

Tablet

Collapsed Sidebar

Feed

Mobile

Top Navigation

Feed

Bottom Navigation

Reuse existing layouts.

---



# Feed Card

Create reusable Feed Card.

Display:

Author Avatar

Author Name

Username

Verified Badge (future)

Post Time

Category

Reading Time

Title

Cover Image

Short Preview

Tags

Views

Like Count

Comment Count

Bookmark Count

Share Button

Read More

---



# Feed Card Components

Create:

FeedCard

FeedHeader

FeedContent

FeedImage

FeedFooter

ReadingTime

CategoryBadge

TagList

ViewCounter

InteractionBar

AuthorInfo

---



# Reading Progress

Implement:

Reading Progress Bar

Estimated Reading Time

Continue Reading Placeholder

Reading Position Architecture

Future-ready.

---



# Infinite Scroll

Implement:

Intersection Observer

Auto Loading

Loading Skeletons

Retry

No page refresh.

---



# Feed States

Support:

Loading

Empty Feed

Offline

API Error

Retry

No Posts Yet

Future Personalized Feed

---



# Right Sidebar

Create placeholders:

Trending Tags

Recommended Writers

Reading Streak

Suggested Topics

Popular Categories

Recent Activity

No backend yet.

---



# Redux

Create Feed Slice.

Support:

Feed List

Loading

Refreshing

Pagination

Error

Selected Feed

Future Filters

Use Redux Toolkit + Thunks.

---



# Services

Create:

feed.service.ts

No API logic inside components.

---



# Components

Create reusable components.

FeedCard

FeedSkeleton

FeedGrid

FeedList

InfiniteLoader

FeedEmpty

FeedError

FeedHeader

CategoryChip

ReadingTimeBadge

TagChip

AuthorCard

TrendingSidebar

SuggestionCard

RefreshButton

---


# Animations

Use Framer Motion.

Implement:

Card Entrance

Image Fade

Hover Effects

Infinite Loading

Skeleton Transition

Content Reveal

Keep animations subtle.

---



# Responsive Design

Desktop

Laptop

Tablet

Mobile

Perfect spacing.

No duplicated feed layouts.

---

# Accessibility

Support:

Keyboard Navigation

Screen Readers

Focus Management

ARIA Labels

Reduced Motion

---

# Performance

Implement:

React.memo

Virtualization Architecture (future-ready)

Image Lazy Loading

Infinite Scroll Optimization

Code Splitting

Avoid unnecessary renders.

---

# Future Compatibility

Architecture should easily support:

Likes

Comments

Bookmarks

Follow

AI Recommendations

Trending

Ads

Pinned Posts

Without refactoring.

---

# Final Verification

Before finishing verify:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated feed cards

✓ Infinite Scroll works

✓ Skeletons work

✓ Responsive layout

✓ Feed state managed by Redux

✓ Services separated correctly

✓ Pages contain no business logic

Stop after the Home Feed is fully complete.

Do NOT begin Post Details, Comments, Likes, or Bookmarks.