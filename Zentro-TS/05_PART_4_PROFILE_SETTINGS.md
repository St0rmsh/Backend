# Zentro Frontend — PART 4 (Profile & Settings)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md
- 03_PART_2_AUTH_UI.md
- 04_PART_3_NAVIGATION_LAYOUT.md

Authentication and Navigation are complete.

Do NOT modify previous implementations unless fixing critical bugs.

This phase builds the complete Profile and Settings system.

Do NOT implement Feed, Posts, Comments, Likes, Followers, Notifications Page, Search, Messaging, or Admin Dashboard.

---

# Goal

Build a modern profile experience inspired by:

- Instagram
- Threads
- X (Twitter)
- Medium

Everything should be reusable.

Everything should be production-ready.

---

# Backend APIs

Use the existing backend.

## Current User

GET

```
/auth/me
```

---

## Update Profile

PATCH

```
/auth/update-profile
```

Supports:

- username
- fullname
- bio
- avatar
- banner

---

## Change Password

POST

```
/auth/change-password
```

---

# Folder Structure

Create:

features/profile/

    components/

    pages/

    services/

    state/

Follow the 4-layer architecture.

---

# Pages

Implement:

Profile Page

Edit Profile

Settings

Account Settings

Appearance Settings

Security Settings

Change Password

---

# Profile Header

Build reusable components:

ProfileBanner

ProfileAvatar

ProfileInfo

ProfileStats

ProfileActions

ProfileTabs

BioSection

SocialLinks (future-ready)

VerificationBadge (future-ready)

---

# Edit Profile

Allow editing:

Username

Full Name

Bio

Avatar

Banner

Live Preview

Cancel

Reset

Save Changes

Dirty Form Detection

Unsaved Changes Warning

---

# Avatar Upload

Support:

Drag & Drop

Click Upload

Preview

Crop Ready

Replace

Remove

Validation

Image Compression

Progress Bar

ImageKit + Multer compatible

---

# Banner Upload

Support:

Drag & Drop

Click Upload

Preview

Replace

Remove

Validation

Progress

---

# Settings

Create sections:

General

Appearance

Security

Account

Privacy (future-ready)

Notifications (future-ready)

Danger Zone

---

# Change Password

Reuse authentication infrastructure.

Support:

Old Password

New Password

Confirm Password

Password Strength

Realtime Validation

Success Message

---

# Appearance

Implement:

Dark

Light

System

Font Size (future-ready)

Reading Width (future-ready)

Animations Toggle (future-ready)

---

# Security

Display:

Verified Email

Last Login (placeholder)

Password Status

Connected Devices (future-ready)

2FA (future-ready)

Passkeys (future-ready)

---

# Profile Statistics

Display placeholders for:

Posts

Followers

Following

Bookmarks

Likes Received

Reading Streak

Achievement Badges

Recent Activity

Future-ready only.

---

# Components

Create reusable components:

ProfileCard

StatCard

EditableField

EditableTextarea

UploadCard

SettingsCard

SettingsGroup

SettingsItem

DangerZone

PasswordForm

AvatarUploader

BannerUploader

SectionHeader

ProfileSkeleton

---

# Redux

Extend User Slice.

Support:

Current User

Profile Updates

Loading

Errors

Optimistic Updates

---

# Services

Create:

profile.service.ts

settings.service.ts

upload.service.ts (reuse existing if possible)

No API calls inside components.

---

# Validation

Use React Hook Form + Zod.

Validate:

Username

Full Name

Bio Length

Avatar Type

Banner Type

Password

---

# Animations

Use Framer Motion.

Implement:

Profile Entrance

Avatar Hover

Banner Fade

Card Reveal

Settings Transition

Button Hover

Loading States

---

# Responsive Design

Desktop

Laptop

Tablet

Mobile

Perfect responsiveness.

---

# Accessibility

Support:

Keyboard Navigation

ARIA Labels

Screen Readers

Focus Management

Reduced Motion

---

# Performance

Use:

React.memo

Lazy Components

Image Lazy Loading

Code Splitting

Avoid unnecessary re-renders.

---

# Future Compatibility

Architecture should easily support:

Profile Posts

Saved Posts

Liked Posts

Drafts

Followers

Following

Achievements

Analytics

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated profile components

✓ Zero duplicated upload logic

✓ Zero business logic inside pages

✓ Responsive on all devices

✓ Authentication still works

✓ Navigation still works

✓ Profile updates work correctly

✓ Change Password works correctly

Stop after Profile and Settings are fully complete.

Do NOT begin Feed or Posts.