# Zentro Frontend — PART 14 (Settings & User Preferences)

## Objective

Read completely before implementation.

Required Documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 13

Everything implemented previously must continue working.

Do NOT modify previous modules unless required for integration.

This phase implements the complete Settings & Preferences System.

Do NOT implement

- Admin Dashboard
- AI Recommendations
- Messaging
- Analytics Dashboard

---

# Goal

Build a production-ready settings experience inspired by

- Instagram
- GitHub
- Discord
- Notion
- Linear

Settings should feel clean, modern, and easy to navigate.

---

# Routes

Create

/settings

Nested Routes

/settings/profile

/settings/account

/settings/security

/settings/appearance

/settings/preferences

/settings/privacy

/settings/about

/settings/help

Protected Routes only.

---

# Folder Structure

features/

    settings/

        components/

        pages/

        services/

        state/

        hooks/

        types/

Follow strict 4-layer architecture.

---

# Backend APIs

Integrate existing APIs.

PATCH

/auth/update-profile

POST

/auth/change-password

POST

/auth/send-otp

POST

/auth/verify-otp

POST

/auth/logout

Future-ready architecture for

Notification Preferences

Privacy

Language

Blocked Users

Connected Accounts

---

# Redux

Create

Settings Slice

Manage

Current Settings

Theme

Language

Loading

Errors

Success Messages

Preferences

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

Create

settings.service.ts

No API calls inside components.

---

# Sidebar Navigation

Create reusable Settings Sidebar.

Sections

Profile

Account

Security

Appearance

Preferences

Privacy

About

Help

Support responsive layouts.

---

# Profile Settings

Allow updating

Username

Full Name

Bio

Avatar

Banner

Preview changes before saving.

Support

Drag & Drop

Click Upload

Image Preview

Validation

Progress Indicator

---

# Account Settings

Display

Email

Verification Status

Joined Date

Account ID

Role

Account Status

Future-ready for

Delete Account

Deactivate Account

---

# Security Settings

Support

Change Password

Send OTP

Verify OTP

Active Sessions (placeholder)

Future-ready

Two Factor Authentication

Login History

Device Management

---

# Appearance

Support

Dark Theme

Light Theme

System Theme

Font Size

Compact Mode (future)

Animation Toggle

Persist preferences.

---

# Preferences

Prepare UI for

Language

Reading Preferences

Feed Preferences

Auto Play

Accessibility

Future-ready.

---

# Privacy

Prepare UI for

Private Account

Blocked Users

Muted Users

Visibility

Future backend integration.

---

# About

Display

Version

Build Number

Release Notes

Terms

Privacy Policy

Licenses

---

# Help

Support

FAQ

Report Bug

Contact Support

Feedback Form

Future-ready.

---

# Components

SettingsLayout

SettingsSidebar

SettingsCard

SettingsSection

SettingsHeader

ProfileEditor

AppearanceSelector

ThemeSwitcher

PreferenceToggle

PasswordForm

SecurityCard

HelpCard

AboutCard

SettingSkeleton

SettingsLoader

---

# UX

Autosave Architecture (future)

Confirmation Dialogs

Loading Indicators

Success Toasts

Error States

Unsaved Changes Warning

Reset Changes

---

# Animations

Use Framer Motion.

Animate

Sidebar

Cards

Tabs

Save Success

Dialog

Hover

Keep animations minimal.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Screen Readers

Reduced Motion

Focus Management

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Perfect responsiveness.

---

# Performance

Memoize components.

Lazy load settings pages.

Avoid unnecessary renders.

---

# Future Compatibility

Architecture should support

Two Factor Authentication

OAuth Connections

Notification Preferences

Blocked Users

Language Packs

Accessibility Profiles

Without refactoring.

---

# Final Verification

Verify at least 3–4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Zero duplicated components

✓ Profile updates work

✓ Change password works

✓ Theme switching works

✓ Responsive layouts

✓ No API calls inside components

✓ Pages contain no business logic

Stop after the Settings System is completely finished.