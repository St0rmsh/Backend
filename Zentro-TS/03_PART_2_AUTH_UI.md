# Zentro Frontend — PART 2 (Authentication UI)

## Objective

Read completely before writing any code:

- 00_MASTER_GUIDE.md
- 01_PART_0_FOUNDATION.md
- 02_PART_1_AUTH_INFRASTRUCTURE.md

Authentication infrastructure is already complete.

Do NOT recreate:

- Axios
- Redux Store
- Redux Slices
- Auth Services
- User Services
- Upload Services
- Socket Lifecycle
- Route Guards

Reuse everything.

This phase focuses ONLY on the Authentication User Interface.

---

# Goal

Build a premium authentication experience inspired by:

- Linear
- Notion
- Instagram
- Threads
- Clerk
- Supabase

The UI must feel like a professional SaaS product.

Dark theme first.

Minimal.

Elegant.

Responsive.

Accessible.

---

# Pages

Implement the following pages:

- Login
- Register
- Forgot Password
- Reset Password
- Verify OTP
- Change Password

Each page should live inside:

features/auth/

    pages/

    components/

No business logic inside pages.

Pages should only compose reusable components.

---

# Components

Create reusable authentication components.

Examples:

AuthLayoutCard

AuthHero

AuthHeader

AuthFooter

LoginForm

RegisterForm

ForgotPasswordForm

ResetPasswordForm

OTPVerificationForm

ChangePasswordForm

PasswordInput

EmailInput

UsernameInput

FullnameInput

OTPInput

PasswordStrengthMeter

PasswordRequirementList

ResendOTPButton

CountdownTimer

FormDivider

AuthIllustration

FormError

FormSuccess

SocialButton (future-ready)

LoadingButton

UploadAvatarPreview

UploadBannerPreview

AnimatedBackground

GlassCard

---

# Forms

Use:

- React Hook Form
- Zod

Every form must support:

Realtime validation

Touched validation

Blur validation

Submit validation

Loading state

Disabled state

Success state

Error state

Friendly validation messages

No duplicated validation logic.

---

# Login Page

Implement:

Email

Password

Show Password

Hide Password

Caps Lock Warning

Remember visual focus state

Forgot Password link

Register link

Loading button

Animated submit

Auto-focus email field

Use Redux Thunk.

No API calls directly.

---

# Register Page

Implement:

Username

Full Name

Email

Password

Confirm Password

Password Strength Meter

Password Rules

Live validation

Show/Hide Password

Animated success

Redirect to Login or Verification depending on backend response.

---

# Forgot Password

Implement:

Email input

Submit

Loading

Success state

Resend support

Friendly instructions

---

# Reset Password

Implement:

OTP

New Password

Confirm Password

Password Strength

Validation

Success screen

Redirect Login

---

# Verify OTP

Implement:

OTP Input

6-digit UI

Paste support

Auto Focus

Backspace Navigation

Countdown Timer

Resend OTP

Loading State

Success Animation

---

# Change Password

Protected page.

Implement:

Old Password

New Password

Confirm Password

Strength Meter

Validation

Success Message

---

# Upload UI

Reuse upload infrastructure.

Implement UI for:

Avatar Upload

Banner Upload

Support:

Drag & Drop

Click Upload

Preview

Remove

Replace

Progress Bar

Validation

Compression Status

No backend duplication.

---

# UX

Every page should include:

Hero Section

Small illustration

Helpful subtitle

Animated transitions

Keyboard shortcuts

Enter submits form

Tab order correct

Smooth focus transitions

Professional spacing

Consistent typography

---

# Design

Theme:

Dark First

Primary:

Slate

Gray

Black

White

Accent:

Small amount of

Blue

Purple

Pink

No colorful gradients.

No neon colors.

No mismatched typography.

---

# Typography

Reuse global typography.

Never hardcode font sizes.

Headings

Body

Labels

Buttons

Links

Captions

Must remain consistent.

---

# Animations

Use Framer Motion.

Create smooth animations for:

Page Transition

Card Entrance

Form Fade

Input Focus

Button Hover

Button Loading

OTP Animation

Success Animation

Error Shake

Keep animations subtle.

---

# Accessibility

Support:

Keyboard Navigation

ARIA Labels

Focus Trap

Screen Readers

Reduced Motion

Proper Input Labels

Proper Error Messages

---

# Responsive Design

Support:

Desktop

Laptop

Tablet

Mobile

Forms should never overflow.

Buttons should remain accessible.

---

# Performance

Use:

React.memo

Lazy Loading

Code Splitting

Avoid unnecessary re-renders.

Do not duplicate components.

---

# Future Compatibility

Authentication UI must support future additions:

Google Login

GitHub Login

Discord Login

Magic Link

2FA

Passkeys

Biometrics

Without major refactoring.

---

# Final Verification

Before finishing verify at least 3–4 times:

✓ Zero TypeScript errors

✓ Zero React warnings

✓ Zero duplicated components

✓ Zero duplicated validation

✓ Zero business logic inside pages

✓ Redux Thunks work correctly

✓ Responsive on all devices

✓ Accessibility passes

✓ Authentication infrastructure still works

✓ Socket lifecycle still works

✓ Route Guards still work

Stop after the complete Authentication UI is finished.

Do NOT begin Navigation, Feed, Profile, or any other feature.