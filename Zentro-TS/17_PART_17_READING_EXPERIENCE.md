# Zentro Frontend — PART 17 (Reading Experience & User Engagement)

## Objective

Read completely before implementation.

Required Documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 16

Everything implemented previously must continue working.

Do NOT modify previous modules unless required for integration.

This phase focuses on maximizing user engagement, reading time, retention, and overall reading experience.

Do NOT implement

- PWA
- Testing
- Production Optimization

---

# Goal

Create one of the best reading experiences among modern blogging platforms.

Inspired by

- Medium
- Kindle
- Notion
- Substack
- Instagram
- Threads

The application should encourage users to

- Read longer
- Read more articles
- Return daily
- Discover new content
- Build reading habits

---

# Folder Structure

features/

    reading/

        components/

        pages/

        services/

        state/

        hooks/

        types/

Follow strict 4-layer architecture.

---

# Redux

Create

Reading Slice

Store

Current Reading Session

Reading Progress

Continue Reading

Reading History

Daily Goal

Weekly Goal

Achievements

Reading Streak

Recently Viewed

Estimated Time

Loading

Errors

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

reading.service.ts

No API logic inside components.

---

# Reading Progress

Track automatically

Current Scroll

Current Paragraph

Reading Percentage

Estimated Time Remaining

Words Read

Reading Speed

Progress Bar

Save progress automatically.

---

# Continue Reading

Display

Last Read Article

Progress

Remaining Time

Resume Button

Automatically restore reading position.

---

# Reading History

Display

Recently Viewed Articles

Reading Date

Completion %

Category

Author

Resume

Clear History

---

# Reading Goals

Support

Daily Goal

Weekly Goal

Monthly Goal

Reading Minutes

Articles Read

Completion %

Progress Visualization

Future backend synchronization ready.

---

# Reading Streak

Display

Current Streak

Longest Streak

Weekly Activity

Monthly Activity

Milestones

Examples

3 Days

7 Days

30 Days

100 Days

---

# Achievement System

Create reusable achievement cards.

Examples

First Blog Read

10 Articles Read

100 Minutes Read

30 Day Streak

Top Reader

Category Explorer

Future AI achievements.

---

# Estimated Reading Time

Display

5 min read

10 min read

18 min read

Automatically visible

Feed

Search

Bookmarks

Article Header

Recommendations

---

# Reading Preferences

Prepare support for

Font Size

Reading Width

Line Height

Dark Mode

Light Mode

Reading Focus Mode

Distraction Free Mode

Future ready.

---

# Reading Session

Display

Reading Timer

Current Progress

Estimated Completion

Words Remaining

Current Chapter (future)

---

# Smart Resume

Automatically restore

Scroll Position

Current Paragraph

Current Section

Current Page

Future backend synchronization ready.

---

# Components

ReadingProgressBar

ReadingStats

ContinueReadingCard

ReadingHistory

ReadingGoalCard

ReadingStreakCard

AchievementCard

ReadingPreferences

ReadingTimer

EstimatedReadingTime

FocusModeButton

ReadingSkeleton

---

# UX

Smooth reading experience.

No layout shift.

Sticky progress bar.

Floating Continue Reading button.

Automatic save every few seconds.

Smooth resume.

---

# Animations

Use Framer Motion.

Animate

Progress Bar

Achievement Unlock

Reading Cards

Streak Updates

Goal Completion

Continue Reading

Keep animations subtle.

---

# Accessibility

Keyboard Navigation

Reduced Motion

Screen Reader Support

Readable Typography

Proper Contrast

Focus Visibility

---

# Responsive

Desktop

Laptop

Tablet

Mobile

Reading experience should remain excellent across all devices.

---

# Performance

Memoize reading calculations.

Avoid unnecessary updates.

Throttle scroll events.

Lazy load below-the-fold content.

---

# Future Compatibility

Architecture must support

AI Reading Coach

Reading Analytics

Reading Challenges

Book Collections

Offline Reading

Audio Narration

Without refactoring.

---

# Final Verification

Verify at least 4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Reading Progress works

✓ Continue Reading works

✓ Reading History works

✓ Reading Goals work

✓ Reading Streak works

✓ Achievements work

✓ Responsive layouts

✓ No duplicated business logic

✓ No unnecessary re-renders

✓ Professional UI consistency

Stop after the Reading Experience system is completely finished.