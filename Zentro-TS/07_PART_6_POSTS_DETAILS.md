# Zentro Frontend — PART 6 (Post Details / Reading Experience)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md
- 03_PART_2_AUTH_UI.md
- 04_PART_3_NAVIGATION_LAYOUT.md
- 05_PART_4_PROFILE_SETTINGS.md
- 06_PART_5_HOME_FEED.md

Everything implemented previously must remain untouched unless fixing critical bugs.

This phase builds ONLY the Single Post Details page and the complete reading experience.

Do NOT implement:

- Comments
- Likes
- Bookmarks
- Follow Button Logic
- Notifications
- Search
- Admin

Only create placeholders where necessary.

---

# Goal

Build a modern reading experience inspired by:

- Medium
- Hashnode
- Dev.to
- Notion
- Linear

The page should maximize reading time and provide a distraction-free experience.

Everything must be production-ready.

---

# Backend APIs

Use existing backend APIs.

Implement:

GET /posts/:postId

Support loading, error handling, and retry.

---

# Folder Structure

Create:

features/post/

    components/

    pages/

    services/

    state/

Follow the strict 4-layer architecture.

---

# Pages

Implement:

PostDetailsPage

Only this page.

---

# Layout

Desktop

Sidebar

Reading Area

Recommendation Sidebar

Tablet

Collapsed Sidebar

Reading Area

Mobile

Top Navigation

Reading Area

Bottom Navigation

Reuse existing layouts.

---

# Reading Header

Display:

Cover Image

Category

Title

Subtitle (future-ready)

Author Avatar

Author Name

Username

Published Date

Updated Date

Estimated Reading Time

View Count

---

# Reading Content

Render:

Headings

Paragraphs

Lists

Code Blocks

Blockquotes

Tables

Images

Videos (future-ready)

Embeds (future-ready)

Markdown-ready architecture.

---

# Reading Progress

Implement:

Sticky Reading Progress Bar

Reading Percentage

Estimated Remaining Time

Scroll Position Tracking

Auto Save Reading Position (frontend only)

---

# Reading Controls

Create UI for:

Increase Font Size

Decrease Font Size

Reset Font Size

Reading Width

Focus Mode

Theme Toggle

Print (future-ready)

Share (placeholder)

---

# Table of Contents

Generate automatically from headings.

Support:

Smooth Scroll

Active Section Highlight

Sticky Sidebar

Mobile Drawer

---

# Author Card

Display:

Avatar

Name

Username

Bio

Followers (placeholder)

Posts Count (placeholder)

Follow Button (placeholder)

No follow functionality yet.

---

# Recommended Reading

Create reusable section.

Display placeholder cards for:

Related Articles

Recommended Blogs

Trending Articles

Continue Reading

Architecture only.

---

# Interaction Bar

Create UI for:

Like

Bookmark

Comment

Share

Copy Link

Report

No backend calls yet.

Use placeholders.

---

# Reading Features

Implement:

Reading Progress

Sticky Header

Estimated Reading Time

Continue Reading Architecture

Auto Scroll Restoration

Smooth Anchor Navigation

---

# Components

Create reusable components.

PostHeader

PostCover

PostMeta

AuthorCard

ReadingProgress

TableOfContents

PostContent

CodeBlock

ImageBlock

QuoteBlock

InteractionBar

RecommendationCard

RecommendationList

ReadingControls

ScrollToTopButton

PostSkeleton

PostError

---

# Redux

Create Post Slice.

Support:

Current Post

Loading

Error

Reading Progress

Reading Position

Future Related Posts

Use Redux Toolkit + Thunks.

---

# Services

Create:

post.service.ts

No API logic inside components.

---

# Animations

Use Framer Motion.

Implement:

Page Entrance

Cover Reveal

Content Fade

Section Reveal

Image Fade

Sticky Elements

Scroll Progress

Keep animations subtle.

---

# Responsive Design

Desktop

Laptop

Tablet

Mobile

Perfect readability on all devices.

---

# Accessibility

Support:

Keyboard Navigation

ARIA Labels

Focus Management

Reduced Motion

Screen Readers

Skip to Content

---

# Performance

Implement:

Image Lazy Loading

Code Splitting

Memoization

Scroll Optimization

Avoid unnecessary re-renders.

Future support for virtualization.

---

# Future Compatibility

Architecture must easily support:

Comments

Likes

Bookmarks

Realtime Views

Realtime Reading Progress

AI Summaries

AI Highlights

Without refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated components

✓ Reading Progress works

✓ Table of Contents works

✓ Responsive layout

✓ Services separated correctly

✓ Redux state clean

✓ Pages contain no business logic

Stop after the complete Post Details page is finished.

Do NOT begin Comments, Likes, Bookmarks, or Follow functionality.