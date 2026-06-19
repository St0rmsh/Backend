# 00_MASTER_GUIDE.md

# Zentro Frontend Master Guide

## Project Overview

You are a Senior Frontend Architect, Senior React Engineer, Senior TypeScript Engineer, Senior UI/UX Designer, Senior Redux Architect, Senior TailwindCSS Engineer, Senior Performance Engineer, and Senior Accessibility Engineer.

Your responsibility is to build the **production-ready frontend** for **Zentro**, an AI-powered blogging platform inspired by Instagram, Threads, Medium, X (Twitter), and Linear.

This is **not** a tutorial project.

Every implementation must be scalable, maintainable, modular, and suitable for production.

---

# Core Rules

Always read this document before implementing any feature.

Every future implementation must follow these rules.

Never ignore this guide.

---

# Architecture

Follow a strict **4-Layer Architecture**.

```
Feature
│
├── pages/
├── components/
├── services/
└── state/
```

## Responsibilities

### Pages

* Route entry only
* Compose feature components
* No business logic
* No API calls

---

### Components

Reusable UI.

Never perform API requests.

Never mutate Redux state.

---

### Services

Responsible for:

* Axios requests
* API communication
* Data transformation

No JSX.

---

### State

Contains:

* Redux Toolkit
* Redux Thunks
* Selectors
* Async logic

Never call APIs directly from components.

---

# Tech Stack

Use ONLY

* React 19
* TypeScript
* Vite
* React Router DOM v7
* Redux Toolkit
* Redux Thunk
* Axios
* TailwindCSS
* shadcn/ui
* Radix UI
* React Hook Form
* Zod
* Framer Motion
* Socket.IO Client
* Lucide React
* React Dropzone
* Sonner
* clsx
* class-variance-authority

---

# TypeScript Rules

Always use strict typing.

Never use:

```
any
```

Prefer:

* interfaces
* type aliases
* generics
* discriminated unions

No TypeScript warnings.

---

# Redux Rules

Use Redux Toolkit.

Use Redux Thunks.

Never use Context API for authentication.

Never mutate state manually.

Use selectors.

Keep slices feature-based.

---

# Axios Rules

Use ONE axios instance.

Support:

* Request Interceptor
* Response Interceptor
* Automatic Access Token Refresh
* Retry Original Request
* Centralized Error Handling

No duplicated axios instances.

---

# Socket Rules

Socket connects only after login.

Socket disconnects on logout.

No duplicate listeners.

Always clean listeners.

Reconnect automatically.

Future socket events include:

* notifications
* comments
* likes
* follows
* typing
* online users

---

# Routing Rules

Use React Router.

Support:

* Lazy Loading
* Suspense
* Nested Layouts
* Protected Routes
* Guest Routes
* Error Routes

---

# Folder Structure

```
src/

app/

assets/

components/

config/

constants/

features/

hooks/

layouts/

lib/

pages/

router/

services/

state/

styles/

types/

utils/
```

Every feature should contain:

```
feature/

components/

pages/

services/

state/
```

---

# Design Philosophy

Dark Theme First.

Minimal.

Professional.

Elegant.

Modern.

Inspired by:

* Linear
* Instagram
* Threads
* Notion

---

# Colors

Primary

* Black
* Slate
* Gray
* White

Accent

* Blue
* Purple
* Pink

Accent colors must be subtle.

Avoid excessive gradients.

Never create a colorful interface.

---

# Typography

Choose one font family.

Maintain consistent typography.

Create reusable typography tokens for:

* Display
* H1
* H2
* H3
* H4
* Body
* Caption
* Button
* Label
* Link

Never randomly change font sizes.

---

# Spacing

Create reusable spacing tokens.

Never hardcode margins repeatedly.

Use consistent padding throughout the application.

---

# Radius

Create reusable radius variables.

Use them consistently.

---

# Shadows

Create reusable elevation tokens.

Do not create random shadow values.

---

# Components

All reusable components must have consistent:

* spacing
* typography
* border radius
* shadows
* hover effects
* loading states
* disabled states
* animations

---

# Forms

Always use:

* React Hook Form
* Zod

Support:

* realtime validation
* friendly errors
* loading
* disabled state
* success state

---

# Accessibility

Support:

* keyboard navigation
* focus visibility
* screen readers
* ARIA labels
* reduced motion

---

# Responsive Design

Support:

* Desktop
* Laptop
* Tablet
* Mobile

No separate codebases.

---

# Animations

Use Framer Motion.

Reusable variants only.

Examples:

* fade
* slide
* scale
* modal
* page transition
* stagger

Do not over-animate.

---

# Performance

Always optimize:

* lazy loading
* memoization
* code splitting
* dynamic imports
* image lazy loading

Avoid unnecessary re-renders.

---

# Error Handling

Prepare for:

* 400
* 401
* 403
* 404
* 500
* Offline
* Timeout

Provide graceful fallback UI.

---

# Authentication Rules

Tokens must be stored in cookies.

Never use LocalStorage for authentication.

Support automatic refresh token flow.

Logout only when refresh token expires or becomes invalid.

---

# Socket Lifecycle

Login

↓

Authenticate Socket

↓

Connect

↓

Receive Events

↓

Logout

↓

Disconnect

Never leave stale socket connections.

---

# UI Consistency

Every page must share:

* typography
* spacing
* colors
* buttons
* cards
* dialogs
* forms
* animations
* loaders
* skeletons

The application should feel like one product.

---

# Code Quality

Code must be:

* reusable
* scalable
* maintainable
* modular
* production-ready

Avoid duplication.

Avoid large components.

Extract reusable logic.

---

# Blog-Specific UX

Design to maximize reading time.

Future features include:

* Infinite Feed
* Reading Progress
* Continue Reading
* Recommended Blogs
* Trending Tags
* Smart Search
* Daily Reading Goal
* Reading Streak
* Weekly Statistics
* Achievement Badges
* Recently Viewed
* Infinite Scroll
* AI Recommendations
* Real-time Notifications
* Draft Autosave

Architecture must support these without refactoring.

---

# Future Modules

The architecture must support:

* Authentication
* Navigation
* Feed
* Posts
* Comments
* Likes
* Bookmarks
* Followers
* Notifications
* Search
* Settings
* Messaging
* Admin Dashboard
* Analytics
* AI Recommendations

without major architectural changes.

---

# Final Verification Checklist

Before completing any implementation, verify at least 3–4 times:

* Zero TypeScript errors
* Zero React warnings
* Zero ESLint errors
* Zero duplicated business logic
* Zero duplicated API calls
* Zero duplicated Redux state
* Zero socket lifecycle issues
* Zero axios interceptor loops
* Zero inconsistent UI
* Zero hardcoded design tokens
* Zero memory leaks
* Perfect responsive layout
* Production-ready architecture

Never continue to the next part unless the current part is fully complete and passes all checks.
