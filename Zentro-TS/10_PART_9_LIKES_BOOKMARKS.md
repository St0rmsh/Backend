# Zentro Frontend — PART 9 (Likes & Bookmarks)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md
- 03_PART_2_AUTH_UI.md
- 04_PART_3_NAVIGATION_LAYOUT.md
- 05_PART_4_PROFILE_SETTINGS.md
- 06_PART_5_HOME_FEED.md
- 07_PART_6_POST_DETAILS.md
- 08_PART_7_POST_EDITOR.md
- 09_PART_8_COMMENTS.md

Everything implemented previously must remain untouched unless fixing critical bugs.

This phase builds ONLY the Like & Bookmark System.

Do NOT implement:

- Follow
- Notifications
- Search
- Messaging
- Admin

Realtime updates will be implemented later with Socket.IO.

---

# Goal

Build a social engagement system inspired by:

- Instagram
- Threads
- X (Twitter)
- Medium

Every interaction must feel instant and responsive.

---

# Backend APIs

Implement all existing APIs.

Like

POST /likes/:postId

Bookmark




POST /bookmarks/:postId

Get My Bookmarks

GET /bookmarks

Search the Bookmark.routes.ts file to get the correct url and app.ts file to get the final url.

Support pagination.

---

# Folder Structure

Create

features/

    likes/

        components/

        pages/

        services/

        state/

    bookmarks/

        components/

        pages/

        services/

        state/

Follow strict 4-layer architecture.

---

# Like System

Support

Like

Unlike

Optimistic UI

Loading State

Retry on Failure

Disable Multiple Requests

Animated Like Button

Like Count

Future-ready for realtime.

---

# Bookmark System

Support

Bookmark

Remove Bookmark

Bookmark Status

Bookmarks Page

Pagination

Empty State

Loading State

Error State

---

# Bookmarks Page

Create

Saved Posts

Grid/List Toggle

Pagination

Infinite Scroll Ready

Sorting Placeholder

Filter Placeholder

Search Placeholder

---

# Components

Likes

LikeButton

LikeCounter

LikeAnimation

LikeSkeleton

LikeLoader

Bookmarks

BookmarkButton

BookmarkCard

BookmarkGrid

BookmarkList

BookmarkSkeleton

BookmarkEmptyState

BookmarkLoader

---

# Redux

Create

Like Slice

Bookmark Slice

Manage

Loading

Errors

Pagination

Bookmark List

Liked Posts

Optimistic Updates

Use Redux Toolkit

Redux Thunks

---

# Services

Create

like.service.ts

bookmark.service.ts

No API logic inside components.

---

# Optimistic UI

Implement

Instant Like

Instant Bookmark

Rollback on API Failure

Prevent Duplicate Requests

Smooth State Synchronization

---

# Animations

Use Framer Motion

Animate

Heart Pop

Bookmark Fill

Counter Change

Hover

Press

Micro Interactions

Keep animations subtle.

---

# UX

Support

Keyboard Navigation

Loading Buttons

Disabled States

Hover States

Touch Feedback

Error Recovery

Retry

---

# Validation

Prevent

Duplicate Requests

Race Conditions

Double Click Spam

Invalid States

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Perfect responsiveness.

---

# Accessibility

Support

ARIA Labels

Keyboard Navigation

Screen Readers

Focus Management

Reduced Motion

---

# Performance

Implement

Memoization

Optimistic Rendering

Pagination

Lazy Loading

Code Splitting

Avoid unnecessary renders.

---

# Socket Preparation

Prepare architecture for future events

post:like

post:unlike

bookmark:add

bookmark:remove

Do NOT implement realtime yet.

Only architecture.

---

# Future Compatibility

Architecture should easily support

Reaction System

Emoji Reactions

Collections

Folders

Shared Bookmarks

Pinned Bookmarks

Realtime Likes

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated Redux logic

✓ Zero duplicated components

✓ Optimistic UI works

✓ Pagination works

✓ Services separated correctly

✓ Responsive layout

✓ No API calls inside components

✓ Pages contain no business logic

Stop after the Like & Bookmark System is complete.

Do NOT implement Follow, Notifications, Search, or Socket.IO realtime updates.