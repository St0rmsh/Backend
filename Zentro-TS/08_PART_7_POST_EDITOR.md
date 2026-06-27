# Zentro Frontend — PART 7 (Post Editor)

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

Everything implemented previously must remain untouched unless fixing critical bugs.

This phase builds ONLY the complete Post Editor.

Do NOT implement:

- Comments
- Likes
- Bookmarks
- Follow
- Notifications
- Search
- Admin

---

# Goal

Build a modern blog editor inspired by:

- Notion
- Medium
- Hashnode
- Dev.to
- Linear

The editor must be production-ready.

---

# Backend APIs

Implement all existing backend post APIs.

Support:

POST /posts

PATCH /posts/:id

DELETE /posts/:id

GET /posts/:id

Draft support if backend already exists.

If drafts don't exist yet, prepare the architecture.

---

# Folder Structure

Create:

features/post-editor/

    components/

    pages/

    services/

    state/

Follow the strict 4-layer architecture.

---

# Pages

Implement:

Create Post

Edit Post

Draft Editor

Do not mix business logic inside pages.

---

# Editor Layout

Desktop

Sidebar

Editor

Publishing Panel

Tablet

Editor

Publishing Panel Drawer

Mobile

Fullscreen Editor

Bottom Toolbar

Responsive.

---

# Editor Fields

Implement:

Title

Subtitle

Content

Category

Tags

Cover Image

Visibility (future-ready)

Publishing Status

Slug (future-ready)

SEO Description (future-ready)

---

# Cover Image

Support:

Drag & Drop

Click Upload

Preview

Replace

Remove

Validation

Progress Bar

Image Compression

ImageKit compatible

Multer compatible

---

# Rich Editor

Support:

Headings

Paragraphs

Bold

Italic

Underline

Strike

Lists

Checklists

Quotes

Code Blocks

Inline Code

Horizontal Rule

Images

Links

Tables (future-ready)

Embeds (future-ready)

Markdown-ready architecture.

---

# Auto Save

Implement frontend architecture for:

Auto Save

Unsaved Changes Warning

Last Saved Timestamp

Recovery Placeholder

---

# Publishing Panel

Display:

Category

Tags

Reading Time

Word Count

Character Count

Cover Preview

Publish Button

Save Draft Button

Delete Button

---

# Validation

Use:

React Hook Form

Zod

Support:

Realtime Validation

Required Fields

Image Validation

Maximum Length

Friendly Error Messages

---

# Redux

Create Post Editor Slice.

Manage:

Editor State

Current Draft

Publishing State

Saving State

Upload Progress

Validation Errors

Use Redux Toolkit + Redux Thunks.

---

# Services

Create:

postEditor.service.ts

upload.service.ts

No API calls inside components.

---

# Components

Create reusable components.

EditorToolbar

EditorContent

EditorSidebar

EditorFooter

TitleInput

SubtitleInput

CategorySelector

TagSelector

CoverUploader

PublishPanel

WordCounter

ReadingTime

DraftStatus

UnsavedIndicator

UploadProgress

EditorSkeleton

EditorError

---

# UX

Support:

Keyboard Shortcuts

Ctrl + S → Save Draft

Ctrl + Enter → Publish

Auto Focus

Smooth Animations

Responsive Toolbar

Unsaved Changes Dialog

---

# Animations

Use Framer Motion.

Implement:

Toolbar Animation

Sidebar Animation

Upload Progress

Editor Entrance

Publishing Animation

Dialog Animation

Keep animations subtle.

---

# Accessibility

Support:

Keyboard Navigation

Focus Management

ARIA Labels

Screen Readers

Reduced Motion

---

# Performance

Implement:

Lazy Loading

Memoization

Image Lazy Loading

Debounced Auto Save

Code Splitting

Avoid unnecessary renders.

---

# Future Compatibility

Architecture should easily support:

Collaborative Editing

AI Writing Assistant

AI Grammar

AI Summaries

Version History

Scheduled Publishing

Post Templates

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated components

✓ Rich Editor works

✓ Image Upload works

✓ Auto Save architecture ready

✓ Redux state clean

✓ Responsive layout

✓ Services separated correctly

✓ Pages contain no business logic

Stop after the complete Post Editor is finished.

Do NOT begin Comments, Likes, Bookmarks, or Notifications.