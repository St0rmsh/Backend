# Zentro Frontend — PART 16 (AI Recommendations & Personalized Feed)

## Objective

Read completely before implementation.

Required Documents

- 00_MASTER_GUIDE.md
- PART 0 → PART 15

Everything implemented previously must continue working.

Do NOT modify previous modules unless required for integration.

This phase implements the complete AI-powered recommendation experience.

Do NOT implement

- PWA
- Testing
- Final Optimization

---

# Goal

Build an intelligent recommendation system inspired by

- Instagram
- Threads
- TikTok
- Medium
- YouTube Home
- Netflix Recommendation UX

The frontend must maximize

- Reading Time
- Session Length
- User Retention
- Content Discovery

while remaining minimal and professional.

---

# Backend

Integrate recommendation APIs.

Examples

GET

/feed/recommended

GET

/posts/recommended

GET

/users/recommended

GET

/tags/trending

GET

/posts/trending

GET

/posts/continue-reading

Adapt to actual backend endpoints.

---

# Folder Structure

features/

    recommendation/

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

Recommendation Slice

Store

Recommended Feed

Trending Posts

Recommended Users

Trending Tags

Continue Reading

Because You Liked

Popular This Week

Loading

Pagination

Caching

Errors

Use Redux Toolkit.

Use Redux Thunks.

---

# Services

recommendation.service.ts

No API logic inside components.

---

# Home Feed

Create a personalized home feed.

Sections

Recommended For You

Trending Today

Because You Liked

Continue Reading

Recently Viewed

Popular Authors

Trending Categories

Trending Tags

Discover More

Everything should be modular.

---

# Recommendation Cards

Create reusable cards.

Blog Recommendation Card

Author Recommendation Card

Trending Tag Card

Category Card

Reading Progress Card

Continue Reading Card

---

# Continue Reading

Display

Progress Bar

Estimated Time Left

Last Opened

Continue Button

Automatically resume reading.

---

# Reading Progress

Track

Scroll Percentage

Completion Percentage

Reading Time

Estimated Remaining Time

Persist locally.

Future backend sync ready.

---

# Because You Liked

Display posts related to

Liked Posts

Bookmarked Posts

Commented Posts

Viewed Posts

Followed Authors

Future AI-ready architecture.

---

# Trending

Create reusable sections.

Trending Posts

Trending Authors

Trending Categories

Trending Tags

Most Discussed

Most Bookmarked

Most Shared (future)

---

# Recommended Authors

Display

Avatar

Username

Followers

Bio

Follow Button

Recent Posts

Mutual Interests (future)

---

# Smart Feed

Support future ranking signals.

Reading Time

Likes

Bookmarks

Comments

Views

Interest Score

Following

Recency

Popularity

Do NOT hardcode ranking logic.

Frontend should simply render ranked data.

---

# Components

RecommendationSection

RecommendationGrid

RecommendationCard

TrendingCard

ContinueReadingCard

ReadingProgress

RecommendedAuthor

TrendingTags

TrendingCategories

RecommendationSkeleton

RecommendationEmptyState

---

# UX

Infinite Scroll

Smooth Reveal

Skeleton Loading

Optimistic UI

Instant Navigation

No layout shift.

---

# Animations

Framer Motion

Fade

Slide

Stagger

Card Hover

Progress Animation

Section Reveal

Subtle only.

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

Perfect responsiveness.

---

# Performance

Memoize recommendation sections.

Lazy load below-the-fold sections.

Cache recommendation results.

Avoid duplicate API requests.

---

# Future Compatibility

Architecture must support

LLM Recommendations

Semantic Recommendations

Collaborative Filtering

Hybrid Ranking

Personalized AI Feed

Without refactoring.

---

# Final Verification

Verify at least 4 times.

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero Redux anti-patterns

✓ Recommendation sections reusable

✓ Continue Reading works

✓ Reading progress works

✓ Infinite scroll works

✓ Responsive layout

✓ No duplicated business logic

✓ No unnecessary API calls

✓ Professional UI consistency

Stop after the AI Recommendation System is completely finished.