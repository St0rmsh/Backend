# Zentro Frontend — PART 10 (Follow System)

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
- 10_PART_9_LIKES_BOOKMARKS.md

Everything previously implemented must continue working.

Do NOT modify previous features unless fixing critical bugs.

This phase implements ONLY the complete Follow System.

Do NOT implement:

- Notifications
- Socket realtime
- Messaging
- Search
- Admin

---

# Goal

Build a production-ready follow system inspired by

- Instagram
- Threads
- X (Twitter)

The experience should be fast, smooth, and scalable.

---

# Backend APIs

Implement all existing APIs.

Follow User

POST

/follow/:userId

---

Unfollow User

DELETE

/follow/:userId

---

Followers List

GET

/follow/followers/:userId

---

Following List

GET

/follow/following/:userId

---

Follow Status

GET

/follow/status/:userId

---

Search the follow.routes.ts file to get the correct url and app.ts file to get the final url.

Support pagination where applicable.

---

# Folder Structure

Create

features/

    follow/

        components/

        pages/

        services/

        state/

Strictly follow the 4-layer architecture.

---

# Components

Create reusable components.

FollowButton

FollowCard

FollowerCard

FollowingCard

FollowersList

FollowingList

FollowStats

FollowSkeleton

FollowLoader

FollowEmptyState

MutualFollowers

UserMiniCard

UserPreviewCard

UserHoverCard

---

# Follow Button

Support

Follow

Following

Unfollow

Loading

Disabled State

Optimistic UI

Retry on Failure

Prevent duplicate requests

---

# Followers Page

Display

Avatar

Username

Full Name

Bio

Follow Button

Mutual Followers

Pagination

Empty State

Loading

---

# Following Page

Display

Avatar

Username

Full Name

Bio

Follow Button

Pagination

Loading

Empty State

---

# User Preview Card

Create reusable hover card.

Display

Avatar

Banner

Username

Full Name

Bio

Followers Count

Following Count

Posts Count

Follow Button

Future-ready for verification badges.

---

# Profile Integration

Integrate with Profile Page.

Display

Followers Count

Following Count

Clickable Counters

Follow Button

Profile Relationship Status

Own Profile Detection

---

# Redux

Create

Follow Slice

Manage

Followers

Following

Counts

Loading

Errors

Pagination

Optimistic Updates

Relationship Status

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

Create

follow.service.ts

No API logic inside components.

---

# Optimistic Updates

Support

Instant Follow

Instant Unfollow

Rollback on Failure

Prevent duplicate requests

Synchronize follower counts

Synchronize profile state

---

# UX

Implement

Hover Effects

Loading Buttons

Skeleton Loading

Retry

Empty States

Friendly Errors

Touch Feedback

---

# Animations

Use Framer Motion.

Animate

Follow Button

Follower Count

Card Hover

List Reveal

Dialog

Micro Interactions

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

Pagination

Code Splitting

Lazy Loading

Virtualization Ready

Avoid unnecessary re-renders.

---

# Socket Preparation

Prepare architecture for future events.

Create placeholders for

follow:new

follow:remove

online-users

Do NOT implement realtime.

Only architecture.

---

# Future Compatibility

Architecture should support

Suggested Users

Mutual Friends

Verified Users

Private Accounts

Blocked Users

Close Friends

Realtime Follow Updates

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicated business logic

✓ Zero duplicated components

✓ Optimistic UI works

✓ Pagination works

✓ Responsive layout

✓ Services separated correctly

✓ No API calls inside components

✓ Pages contain no business logic

✓ Profile integration works correctly

Stop after the complete Follow System is finished.

Do NOT implement Notifications, Socket.IO realtime, Search, Messaging, or Admin.