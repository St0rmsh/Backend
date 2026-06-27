# Zentro Frontend — PART 11 (Notifications & Socket.IO)

## Objective

Read completely before writing any code.

Required documents

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
- 11_PART_10_FOLLOW_SYSTEM.md

Everything previously implemented must continue working.

Do NOT modify previous implementations unless fixing critical bugs.

This phase implements ONLY

- Notification System
- Socket.IO Integration
- Real-time Notification Badge

Do NOT implement

- Messaging
- Chat
- Search
- Admin
- AI Recommendations

---

# Goal

Build a production-ready notification system inspired by

Instagram

Threads

Facebook

Discord

Notifications must feel instant.

Realtime.

Smooth.

Professional.

---

# Backend APIs

Implement every notification API.

GET

/notification

Returns paginated notifications.

---

GET

/notification/unread-count

Returns unread count.

---

PATCH

/notification/:notificationId/read

Mark one notification as read.

---

PATCH

/notification/read-all

Mark all notifications as read.

---

DELETE

/notification/:notificationId

Delete notification.

---

Support pagination.

Infinite loading.

Optimistic updates.

---

# Existing Socket Backend

The backend already emits

notification

Payload

{
notification,
unreadCount
}

Use this event.

Do NOT invent new events.

---

# Folder Structure

Create

features/

    notification/

        components/

        pages/

        services/

        state/

Follow the strict 4-layer architecture.

---

# Socket Lifecycle

Socket connects

ONLY

after successful login.

Authentication

socket.auth = {

token: accessToken

}

socket.connect()

Disconnect

Immediately on logout.

Reconnect automatically.

Prevent duplicate listeners.

Clean listeners on unmount.

Never create memory leaks.

---

# Redux

Create

Notification Slice

Socket Slice

Support

Notification List

Unread Count

Pagination

Loading

Realtime Updates

Errors

Optimistic Updates

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

Create

notification.service.ts

socket.service.ts

No API logic inside components.

---

# Notification Types

Support

LIKE

COMMENT

FOLLOW

BOOKMARK

SYSTEM

Future Ready

MESSAGE

MENTION

REPLY

ACHIEVEMENT

BADGE

---

# Notification Bell

Create

Notification Bell

Unread Badge

Animated Badge

Realtime Counter

Dropdown Preview

Infinite List

---

# Notification Dropdown

Display

Avatar

Username

Message

Post Preview

Timestamp

Read Status

Unread Indicator

Delete Button

Mark Read

Infinite Scroll

Loading

Skeleton

Empty State

---

# Notification Page

Create dedicated page.

Display

Filters

Unread

All

Read

Pagination

Infinite Scroll

Mark All Read

Delete

Retry

Empty State

---

# Notification Cards

Reusable component.

Display

Sender Avatar

Sender Name

Message

Relative Time

Post Preview

Read Indicator

Hover State

Click Action

---

# Optimistic Updates

Support

Mark Read

Delete Notification

Unread Counter

Rollback on Failure

---

# Badge

Notification badge updates

Immediately

without refresh.

Must stay synchronized

between

Navbar

Notification Page

Dropdown

Redux

Socket

---

# Time Formatting

Support

Just Now

1 min ago

5 min ago

Yesterday

Date Formatting

Use reusable helper.

---

# Socket Events

Implement

notification

Future-ready architecture

notification:read

notification:delete

comment:new

post:like

follow:new

Do NOT implement future events.

Only architecture.

---

# Components

Create reusable

NotificationBell

NotificationBadge

NotificationDropdown

NotificationCard

NotificationList

NotificationSkeleton

NotificationEmptyState

NotificationLoader

NotificationFilters

NotificationHeader

---

# UX

Realtime badge

Smooth animations

Unread indicator

Mark read animation

Delete animation

Loading

Retry

Empty State

Infinite Scroll

---

# Animations

Use Framer Motion.

Animate

Badge Pop

Dropdown

List Items

Mark Read

Delete

Page Transition

Hover

Keep animations subtle.

---

# Accessibility

Support

Keyboard Navigation

ARIA Labels

Focus Management

Reduced Motion

Screen Readers

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Perfect responsiveness.

---

# Performance

Memoization

Pagination

Code Splitting

Lazy Loading

Avoid unnecessary rerenders.

Prevent duplicate socket listeners.

---

# Future Compatibility

Architecture must support

Realtime Comments

Realtime Likes

Realtime Followers

Realtime Messages

Live Activity Feed

Without refactoring.

---

# Final Verification

Verify at least 3–4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicate socket listeners

✓ Zero Axios loops

✓ Zero duplicated business logic

✓ Realtime notifications work

✓ Notification badge updates instantly

✓ Mark Read works

✓ Delete works

✓ Pagination works

✓ Responsive UI

✓ Socket disconnects on logout

✓ Socket reconnects after login

Stop after the Notification System is completely finished.

Do NOT implement Search, Messaging, AI Features, or Admin.