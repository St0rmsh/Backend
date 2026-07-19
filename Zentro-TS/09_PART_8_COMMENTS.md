# Zentro Frontend — PART 8 (Comments System)

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

Everything implemented previously must remain untouched unless fixing critical bugs.

This phase builds ONLY the complete Comment System.

Do NOT implement:

- Likes
- Bookmarks
- Follow
- Notifications
- Search
- Admin

Socket architecture should be prepared but realtime updates will be implemented in a later part.

---

# Goal

Build a modern commenting experience inspired by:

- Instagram
- Threads
- Reddit
- Medium
- YouTube

The comment system must feel extremely responsive and production-ready.

---

# Backend APIs

Implement all existing comment APIs.

Use:

POST /comments

GET /comments/:postId

PATCH /comments/:commentId

DELETE /comments/:commentId


// @route: POST /api/comment/:postId
// @desc: Create a new comment
// @access: Private
POST  /comments/post/:postId


// @desc: Get all comments
GET /comments/post/:postId


// @desc: Get single comment
// @desc: Get single comment
// @access: Public
GET /comments/:commentId


// @route: PATCH /api/comment/:commentId
// @desc: Update a comment
// @access: Private
PATCH /comments/:commentId


// @route: DELETE /api/comment/:commentId
// @desc: Delete a comment
// @access: Private
DELETE  /comments/:commentId

Search the Comment.routes.ts file to get the correct url and app.ts file to get the final url.

Support pagination.

---

# Folder Structure

Create

features/comments/

    pages/

    components/

    services/

    state/

Follow strict 4-layer architecture.

---

# Components

Create reusable components.

CommentList

CommentItem

CommentInput

CommentEditor

CommentActions

CommentHeader

CommentAvatar

CommentSkeleton

CommentLoader

CommentError

CommentEmptyState

LoadMoreComments

CommentPagination

DeleteCommentDialog

EditCommentDialog

CommentTimestamp

---

# Comment Input

Support

Avatar

Rich Text Input

Emoji Ready Architecture

Character Counter

Submit Button

Cancel Button

Loading State

Keyboard Shortcut

Ctrl + Enter → Submit

---

# Comment List

Support

Newest First

Oldest First

Pagination

Infinite Scroll Ready

Load More Button

Virtualization Ready

---

# Comment Actions

Prepare UI for

Edit

Delete

Copy Link

Report

Reply (future)

Pin (future)

Like Comment (future)

---

# Edit Comment

Allow

Inline Editing

Cancel

Save

Validation

Loading

Smooth animation

---

# Delete Comment

Confirmation Dialog

Optimistic UI

Error Recovery

Undo Architecture (future-ready)

---

# Pagination

Support

Previous

Next

Load More

Infinite Scroll Architecture

Future Virtual List

---

# Redux

Create

Comment Slice

State

Current Comments

Loading

Pagination

Editing

Deleting

Creating

Errors

Use Redux Toolkit

Redux Thunks

---

# Services

Create

comment.service.ts

No API logic inside components.

---

# UX

Implement

Auto Focus

Auto Resize Textarea

Smooth Comment Reveal

Skeleton Loading

Empty State

Retry State

Character Counter

Disable Empty Comments

---

# Validation

Use

React Hook Form

Zod

Validate

Required

Maximum Length

Trim Spaces

Prevent Empty Submission

Friendly Errors

---

# Animations

Use Framer Motion

Animate

Comment Appear

Comment Delete

Edit Transition

Loading Skeleton

Dialog

Hover Actions

Keep animations subtle.

---

# Accessibility

Support

Keyboard Navigation

ARIA Labels

Screen Readers

Focus Management

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

Implement

Memoization

Lazy Rendering

Pagination

Virtualization Ready

Code Splitting

Avoid unnecessary renders.

---

# Socket Preparation

Prepare architecture for future events.

Create placeholders for

comment:new

comment:update

comment:delete

Do NOT connect realtime yet.

Only architecture.

---

# Future Compatibility

Architecture should easily support

Nested Replies

Comment Likes

Comment Mentions

GIFs

Image Comments

Voice Comments

Pinned Comments

Realtime Updates

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated components

✓ Zero duplicated Redux logic

✓ Zero API calls inside components

✓ Pagination works

✓ Edit/Delete works

✓ Responsive layout

✓ Services separated correctly

✓ Pages contain no business logic

Stop after the Comment System is complete.

Do NOT implement Likes, Bookmarks, Follow, Notifications, or realtime Socket.IO updates.