# Zentro Frontend — PART 18 (PWA & Offline Experience)

## Objective

Read completely before implementation.

Required Documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 17

Everything implemented previously must continue working.

Do NOT modify previous modules unless required for integration.

This phase transforms Zentro into a Progressive Web App (PWA) with offline capabilities, background synchronization, and installability.

Do NOT implement

- Testing
- Production Deployment

---

# Goal

Transform Zentro into an installable application similar to

- Twitter PWA
- Instagram PWA
- Threads
- Pinterest
- Medium

Users should be able to

- Install the app
- Open instantly
- Read previously loaded blogs offline
- Browse cached content
- Reconnect seamlessly

---

# Technologies

Use

- Vite PWA Plugin
- Workbox
- Service Worker
- Cache Storage API
- IndexedDB
- Background Sync API
- Web App Manifest

---

# Folder Structure

src/

pwa/

service-worker/

offline/

cache/

manifest/

hooks/

utils/

---

# Service Worker

Create

service-worker.ts

Implement

Install

Activate

Fetch

Cache

Sync

Push-ready architecture

No duplicated caching logic.

---

# Manifest

Create

manifest.webmanifest

Configure

App Name

Short Name

Icons

Theme Color

Background Color

Orientation

Display

Start URL

Description

Screenshots

Shortcuts

Categories

Maskable Icons

---

# Install Prompt

Implement

Install Banner

Dismiss

Install Button

Install Dialog

Remember user preference.

---

# Offline Page

Create

/offline

Display

No Internet

Retry Button

Recently Cached Posts

Reading History

Continue Reading

Beautiful illustration.

---

# Cache Strategy

Cache

App Shell

Fonts

Icons

Images

Profile Images

Cover Images

Recently Opened Posts

Trending Posts

Recommendations

Settings

Theme

Do NOT cache sensitive authentication data.

---

# IndexedDB

Store

Reading Progress

Continue Reading

Recently Viewed

Bookmarks (optional)

Draft Posts

Offline Queue

User Preferences

Future-ready.

---

# Offline Reading

Allow users to

Read cached posts

Continue reading

Resume scroll position

Browse history

View saved drafts

Without internet.

---

# Background Sync

Queue

Likes

Bookmarks

Comments

Draft Saves

Profile Updates

Automatically sync when connection returns.

---

# Network Detection

Create

useOnlineStatus()

Display

Online Banner

Offline Banner

Reconnecting State

---

# Offline Queue

Display

Pending Actions

Sync Progress

Retry Failed

Clear Queue

---

# Components

InstallPrompt

OfflineBanner

OfflinePage

SyncStatus

OfflineQueue

CachedPosts

OfflineSkeleton

ReconnectButton

PWASettings

---

# Redux

Create

PWA Slice

Store

Install State

Online Status

Sync Queue

Cached Content

Offline Mode

Loading

Errors

Use Redux Toolkit.

---

# Services

offline.service.ts

cache.service.ts

sync.service.ts

No API logic inside components.

---

# UX

Fast startup.

Instant navigation.

Offline fallback.

Install prompts.

Automatic sync.

No user confusion.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Reduced Motion

Screen Reader Support

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Excellent mobile-first experience.

---

# Performance

Optimize

Caching

Preloading

Image Compression

Lazy Loading

Background Updates

No unnecessary network requests.

---

# Future Compatibility

Architecture should support

Push Notifications

Offline Messaging

Offline Editing

Offline Publishing

Background Uploads

Without refactoring.

---

# Final Verification

Verify at least 4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Service Worker registered

✓ Manifest valid

✓ Install Prompt works

✓ Offline page works

✓ Cached posts available

✓ Background Sync works

✓ Redux state correct

✓ No duplicated caching logic

✓ Responsive layouts

✓ Professional UX

Stop after the PWA and Offline Experience are fully complete.