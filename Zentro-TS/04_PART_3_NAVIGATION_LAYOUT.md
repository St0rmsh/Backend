# Zentro Frontend — PART 3 (Navigation, Layout & Application Shell)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md
- 03_PART_2_AUTH_UI.md

Authentication is already complete.

Do NOT modify authentication unless fixing critical bugs.

This phase builds the complete application shell used by every page in Zentro.

Do NOT implement Feed, Profile, Posts, Comments, Likes, Bookmarks, Notifications Page, Search Results, Messaging, or Admin Dashboard.

Only implement layouts, navigation, routing structure, and reusable shell components.

---

# Goal

Build a production-ready application shell inspired by:

- Instagram
- Threads
- X (Twitter)
- Linear
- Notion

Everything must be reusable.

Everything must feel like ONE application.

---

# Layout Architecture

Implement:

RootLayout

MainLayout

AuthLayout

SettingsLayout

ErrorLayout

Layout hierarchy must support nested routing.

No duplicated layout code.

---

# Application Structure

Desktop

```

Sidebar | Main Content | Right Sidebar

```

Tablet

```

Collapsed Sidebar | Main Content

```

Mobile

```

Top Navigation

Main Content

Bottom Navigation

```

Perfect responsiveness.

---

# Sidebar

Create a reusable Sidebar.

Support:

Expanded

Collapsed

Animated

Resizable (future-ready)

Persistent state

Redux controlled

---

# Navigation Items

Create reusable navigation items.

Include:

Home

Explore

Bookmarks

Notifications

Write

Drafts

Profile

Settings

Logout

Do NOT implement page logic.

Only navigation.

---

# Top Navigation

Implement:

Logo

Global Search Trigger

Notification Icon

Theme Toggle

Profile Avatar

Quick Actions

Responsive Menu

Sticky behavior

---

# Bottom Navigation

Mobile only.

Include:

Home

Explore

Write

Notifications

Profile

Animated active state.

---

# User Dropdown

Implement reusable dropdown.

Include:

Profile

Settings

Change Password

Logout

Smooth animations.

Keyboard accessible.

---

# Command Palette

Implement:

Ctrl + K

⌘ + K

Open a global command dialog.

Only UI.

No search implementation yet.

Future-ready architecture.

---

# Global Search Trigger

Create:

Search Button

Search Modal

Search Input

Empty State

Recent Searches Placeholder

No backend.

No API.

No search logic.

---

# Theme

Complete theme system.

Support:

Dark

Light

System

Persist user preference.

Avoid flash during page load.

---

# UI State

Expand Redux UI Slice.

Manage:

Sidebar

Collapsed Sidebar

Theme

Global Search

Dialogs

Global Loading

Right Sidebar

Mobile Menu

Command Palette

Everything controlled via Redux.

---

# Common Components

Build reusable components.

Sidebar

SidebarGroup

SidebarItem

Navbar

BottomNavigation

UserMenu

ProfileMenu

Breadcrumb

CommandPalette

ThemeToggle

NotificationBadge

Logo

PageContainer

ContentWrapper

StickyHeader

FloatingActionButton

RightSidebar

---

# Breadcrumb System

Create reusable breadcrumb component.

Future-ready.

No hardcoded pages.

---

# Global Portals

Implement:

Modal Portal

Dialog Portal

Toast Portal

Tooltip Portal

Loading Overlay

These should be globally reusable.

---

# Scroll Management

Implement:

Scroll Restoration

Scroll To Top

Preserve Scroll Position

Future support for:

Continue Reading

Infinite Feed

---

# Animations

Use Framer Motion.

Create reusable animations:

Sidebar Expand

Sidebar Collapse

Navbar Reveal

Dropdown

Command Palette

Page Transition

Mobile Navigation

Theme Transition

Hover Effects

Keep animations subtle.

---

# Responsive Design

Support:

Desktop

Laptop

Tablet

Mobile

No duplicated layouts.

No duplicated components.

---

# Accessibility

Support:

Keyboard Navigation

ARIA Labels

Focus Management

Reduced Motion

Screen Reader Support

Proper Landmark Regions

---

# Performance

Use:

React.memo

Lazy Loading

Dynamic Imports

Code Splitting

Avoid unnecessary re-renders.

---

# Future Compatibility

Architecture must support:

Feed

Posts

Profile

Notifications

Search

Messaging

Admin

Analytics

AI Recommendations

Without layout refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated layouts

✓ Zero duplicated navigation

✓ Zero hardcoded colors

✓ Zero hardcoded spacing

✓ Perfect responsive behavior

✓ Authentication still works

✓ Protected Routes still work

✓ Guest Routes still work

✓ Theme switching works

✓ Sidebar state persists

✓ Command Palette opens

Stop after the complete application shell is finished.

Do NOT begin Profile, Feed, Posts, or any other feature.