# Zentro Frontend — PART 13 (Notifications)

## Objective

Read completely before implementation:

- 00_MASTER_GUIDE.md
- PART 0 → PART 12

Do NOT modify previous modules unless required for integration.

This phase implements the complete production-ready Notification System with Socket.IO real-time updates.

Notifications should behave similarly to Instagram, Threads, LinkedIn, and X.

---

# Backend APIs

GET

/api/notification

Returns paginated notifications.

---

GET

/api/notification/unread-count

Returns unread notification count.

---

PATCH

/api/notification/:notificationId/read

Marks one notification as read.

---

PATCH

/api/notification/read-all

Marks every notification as read.

---

DELETE

/api/notification/:notificationId

Deletes one notification.



Search the Notification.routes.ts file to get the correct url and app.ts file to get the final url.

---

# Socket Events

Listen

notification

Payload

{
notification,
unreadCount
}

---

Future Ready Events

notification:read

notification:delete

notification:clear

---

# Routes

Create

/notifications

Protected Route

---

# Feature Structure

features/

notification/

components/

pages/

services/

state/

types/

hooks/

---

# Redux

Create

notificationSlice

Store

notifications

loading

pagination

unreadCount

filters

selectedNotification

socketConnected

Actions

fetchNotifications()

fetchUnreadCount()

markAsRead()

markAllAsRead()

deleteNotification()

prependRealtimeNotification()

clearNotifications()

resetNotifications()

Use Redux Thunks.

No API calls inside components.

---

# Services

notification.service.ts

Implement

getNotifications()

getUnreadCount()

markRead()

markAllRead()

deleteNotification()

---

# Layout

Desktop

Sidebar

↓

Notification Page

Tablet

Responsive

Mobile

Full Width

---

# Navbar Integration

Notification Bell

Unread Badge

Animated Badge

Realtime Badge Update

Dropdown Preview

See All Button

---

# Notification Page

Build

Header

Unread Counter

Mark All Read

Filter Chips

Notification List

Pagination

Empty State

Loading State

Error State

---

# Filters

All

Likes

Comments

Bookmarks

Followers

System

Future Ready

---

# Notification Card

Display

Sender Avatar

Sender Name

Notification Text

Relative Time

Unread Indicator

Optional Post Preview

Hover Animation

Click Animation

Read State

Delete Button

---

# Read Behaviour

Click

↓

Mark Read

↓

Navigate

Examples

Like

↓

Open Post

Comment

↓

Scroll to Comment

Follow

↓

Open Profile

Bookmark

↓

Open Post

---

# Infinite Loading

Support pagination.

Future-ready for infinite scrolling.

---

# Socket Integration

When

notification

arrives

Immediately

prepend notification

Increment unread count

Animate bell

Play subtle animation

Do NOT reload page.

---

# Real-time UX

Notification Dropdown

updates instantly.

Notification Page

updates instantly.

Unread Badge

updates instantly.

---

# Components

NotificationBell

NotificationBadge

NotificationDropdown

NotificationList

NotificationCard

NotificationFilters

NotificationHeader

UnreadIndicator

EmptyNotifications

NotificationSkeleton

---

# Animations

Framer Motion

Fade

Slide

Unread Glow

Bell Bounce

Card Hover

Delete Animation

No excessive animations.

---

# Responsive

Desktop

Laptop

Tablet

Mobile

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus Visible

Reduced Motion

---

# Performance

Memoized Cards

Virtualization Ready

Lazy Images

No unnecessary re-renders.

---

# Final Verification

Verify

✓ Real-time notifications work

✓ Socket updates Redux instantly

✓ Bell badge updates

✓ Notification page updates

✓ Read actions work

✓ Delete works

✓ Pagination works

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicated code

Stop after Notification System is fully complete.