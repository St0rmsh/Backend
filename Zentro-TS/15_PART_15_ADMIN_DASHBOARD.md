# Zentro Frontend — PART 15 (Admin Dashboard & Moderation)

## Objective

Read completely before implementation.

Required Documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 14

Everything implemented previously must continue working.

Do NOT modify previous modules unless required for integration.

This phase implements ONLY the Admin Dashboard and Moderation System.

Do NOT implement

- AI Recommendations
- Reading Analytics
- PWA
- Production Optimization

---

# Goal

Build a professional admin panel similar to

- GitHub Admin
- Vercel Dashboard
- Notion Admin
- Firebase Console
- Discord Moderation

The dashboard should be fast, responsive, scalable, and easy to extend.

---

# Authentication

Support Role-Based Access Control.

Future roles

- USER
- MODERATOR
- ADMIN
- SUPER_ADMIN

Unauthorized users must never access admin routes.

Redirect unauthorized users to 403.

---

# Routes

Create

/admin

Nested Routes

/admin/dashboard

/admin/users

/admin/posts

/admin/comments

/admin/reports

/admin/categories

/admin/tags

/admin/analytics

/admin/settings

/admin/logs

---

# Folder Structure

features/

    admin/

        components/

        pages/

        services/

        state/

        hooks/

        types/

Follow the strict 4-layer architecture.

---

# Dashboard

Create overview cards.

Display

Total Users

Total Posts

Total Comments

Total Likes

Total Bookmarks

Total Reports

Active Users

New Users

Growth Percentage

Charts should be reusable.

---

# Users Management

Display

Avatar

Username

Email

Role

Status

Verification

Joined Date

Actions

Search

Pagination

Filters

Sorting

Bulk Actions

Future-ready.

---

# User Actions

Support

View

Edit

Suspend

Ban

Delete

Change Role

Verify

Unverify

Confirmation dialogs required.

---

# Posts Management

Display

Cover Image

Title

Author

Category

Created Date

Views

Likes

Comments

Actions

Search

Pagination

Filters

---

# Post Actions

View

Edit

Feature

Hide

Delete

Restore

Future-ready.

---

# Comments Moderation

Display

Comment

Author

Post

Created Date

Status

Actions

Support

Delete

Hide

Restore

---

# Reports

Create moderation queue.

Display

Reporter

Reason

Reported User

Reported Post

Reported Comment

Status

Actions

Approve

Reject

Delete

Warn User

Suspend User

---

# Categories

CRUD

Categories

Name

Slug

Color

Description

Order

Visibility

---

# Tags

CRUD

Tags

Trending

Usage Count

Merge Tags

Delete Tags

---

# Analytics

Create reusable analytics dashboard.

Charts

Users Growth

Posts Growth

Daily Activity

Most Active Users

Popular Categories

Popular Tags

Future-ready.

---

# Logs

Display

Admin Actions

User Actions

Moderation Actions

Authentication Logs

Future-ready.

---

# Redux

Create

Admin Slice

Users Slice

Reports Slice

Analytics Slice

Category Slice

Tag Slice

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

Create

admin.service.ts

users.service.ts

reports.service.ts

analytics.service.ts

categories.service.ts

tags.service.ts

No API logic inside components.

---

# Components

AdminLayout

AdminSidebar

AdminNavbar

DashboardCards

StatsCard

UsersTable

PostsTable

CommentsTable

ReportsTable

CategoryTable

TagTable

AnalyticsChart

Pagination

Filters

SearchBar

BulkActionBar

ConfirmationDialog

AdminSkeleton

AdminLoader

---

# Charts

Use a reusable chart library.

Support

Bar

Line

Area

Pie

Future-ready.

---

# UX

Fast Tables

Sticky Headers

Column Sorting

Pagination

Search

Filtering

Bulk Selection

Export (future)

---

# Animations

Use Framer Motion.

Animate

Cards

Tables

Charts

Dialogs

Dropdowns

Sidebar

Keep animations subtle.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus Management

Screen Readers

Reduced Motion

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Admin should remain usable on tablets.

---

# Performance

Memoized Tables

Lazy Routes

Code Splitting

Virtualization Ready

Avoid unnecessary re-renders.

---

# Future Compatibility

Architecture must support

Audit Logs

Role Management

Permissions

Feature Flags

Content Scheduling

System Health

Without refactoring.

---

# Final Verification

Verify at least 4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicated business logic

✓ Zero duplicated tables

✓ Responsive dashboard

✓ Role guards work

✓ Unauthorized users blocked

✓ No API calls inside components

✓ Pages contain no business logic

✓ Professional UI consistency

Stop after the Admin Dashboard is completely finished.