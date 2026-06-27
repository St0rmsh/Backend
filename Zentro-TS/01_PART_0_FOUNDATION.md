# Zentro Frontend — PART 0 (Foundation)

## Objective

Read **00_MASTER_GUIDE.md** completely before writing any code.

This phase is ONLY for creating the production-ready frontend foundation.

Do NOT implement authentication pages, feed, profile, posts, comments, likes, notifications, search, or admin.

The goal is to prepare the entire application architecture so every future feature fits perfectly without refactoring.

---

# Rules

* Follow every rule inside `00_MASTER_GUIDE.md`.
* Do not violate the 4-Layer Architecture.
* Do not skip TypeScript types.
* No `any`.
* No placeholder architecture.
* Everything must be production ready.
* Every folder must be scalable.

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
* Socket.IO Client
* Framer Motion
* Sonner
* Lucide React
* React Dropzone
* clsx
* class-variance-authority

---

# Project Structure

Create the entire folder structure.

Example:

```
src/

app/
config/

router/

layouts/

hooks/

services/
    api/
    auth/
    socket/

state/
    store.ts

    auth/
    user/
    ui/
    loading/
    notification/
    socket/

types/

utils/

constants/

lib/

assets/

styles/

components/
    ui/
    common/
    feedback/
    forms/
    layout/

features/

pages/
```

Even if folders are empty they should exist.

---

# Configure Tailwind

Configure

* Tailwind
* shadcn
* CSS Variables
* Design Tokens

Create

```
globals.css
theme.css
```

---

# Design System

Create reusable tokens.

Typography

Spacing

Radius

Shadows

Animations

Container Width

Breakpoints

Transition Speeds

Never hardcode values repeatedly.

---

# Theme

Dark Theme First

Create CSS Variables.

Primary colors should mostly be

Slate

Gray

Black

White

Accent colors

Blue

Purple

Pink

should be extremely subtle.

No rainbow gradients.

No neon UI.

Professional.

Elegant.

Modern.

---

# Typography

Choose ONE font family.

Apply globally.

Define

Display

Heading 1

Heading 2

Heading 3

Heading 4

Paragraph

Caption

Small Text

Button Text

Links

Forms

Everything should remain consistent throughout the entire application.

Never mix font sizes randomly.

---

# Create Layouts

Create

Root Layout

Auth Layout

Main Layout

Settings Layout

404 Layout

Only skeletons.

No business logic.

---

# Configure Router

Create

Router

Route Config

Lazy Loading

Suspense

404

Protected Route Component

Guest Route Component

Layout Routing

No authentication logic yet.

Only routing structure.

---

# Redux

Configure

Redux Store

Redux Provider

Create empty slices

Auth Slice

User Slice

UISlice

LoadingSlice

NotificationSlice

SocketSlice

ThemeSlice

Use Redux Toolkit.

Use Redux Thunks.

No Context API.

---

# Axios

Create ONE axios instance.

Configure

Base URL

Credentials

Headers

Request Interceptor

Response Interceptor

DO NOT implement refresh token logic yet.

Leave TODO comments.

---

# Socket

Create complete socket architecture.

Create

Socket Service

Socket Slice

Socket Hooks

Socket Types

Socket Utilities

Do NOT connect automatically.

Only architecture.

---

# Environment Variables

Configure

```
VITE_API_URL

VITE_SOCKET_URL

VITE_IMAGEKIT_URL
```

Create env typings.

---

# Utilities

Create

Cookie Helpers

Storage Helpers

Date Helpers

Validation Helpers

Error Helpers

Response Helpers

Classname Helpers

---

# Components

Create reusable production-ready UI components.

Button

Input

Textarea

Card

Dialog

Modal

Avatar

Badge

Loader

Spinner

Skeleton

Toast Wrapper

Empty State

Error State

Page Loader

Container

Section

Logo

Brand

Theme Toggle

Do NOT implement feature-specific components.

---

# Hooks

Create

useAppDispatch

useAppSelector

useDebounce

useMediaQuery

useTheme

useSocket

useLoading

---

# Constants

Create

Routes

API Endpoints

Query Keys

Storage Keys

Theme Constants

Animation Constants

Validation Constants

---

# Types

Create

API Types

Redux Types

Auth Types

User Types

Notification Types

Socket Types

Pagination Types

Common Types

---

# Error Handling

Prepare architecture for

401

403

404

500

Network Errors

Validation Errors

Offline State

Retry UI

No implementation yet.

---

# Loading System

Create

Page Loader

Section Loader

Button Loader

Card Skeleton

Feed Skeleton

Profile Skeleton

Auth Skeleton

Reusable only.

---

# Animations

Configure Framer Motion.

Create reusable variants

Fade

Slide

Scale

Modal

Page Transition

Hover

Stagger

These should be reusable utilities.

---

# Accessibility

Prepare

Keyboard Navigation

Focus Ring

ARIA Support

Reduced Motion

Proper Labels

---

# Performance

Enable

Lazy Imports

Code Splitting

Dynamic Imports

React.memo architecture

No premature optimization.

---

# Output Requirements

At the end of implementation verify

* Zero TypeScript errors
* Zero ESLint errors
* Zero React warnings
* Zero duplicated code
* Zero architecture violations
* Zero unused imports
* Zero hardcoded colors
* Zero hardcoded spacing
* Zero duplicated typography
* Zero duplicated animations

Everything should compile successfully.

Do NOT start authentication.

Stop after the entire foundation is complete and working.
