# Alkira Software Engineer - UI Developer Take-Home

A small React authentication experience implementing the requested **Login → MFA → Protected Screen** flow with validation and role-based access control.

## Technologies used

- React + TypeScript
- Vite
- React Router
- Vitest
- React Testing Library
- Plain CSS (no component library)

## Setup / Install

### Prerequisites

- Node.js 20+
- npm 10+

You can verify your installed versions with:

```bash
node -v
npm -v
```

### Install dependencies

Clone the repository and navigate to the project directory:

```bash
git clone "https://github.com/Anranhhh/alkira-ui-developer.git"
cd alkira-ui-developer
```

Install the dependencies using the committed `package-lock.json`:

```bash
npm ci
```

> Alternatively, `npm install` can be used for local development.

## Run locally

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Mock users

| Role | Email | Password | MFA code |
| --- | --- | --- | --- |
| Read-only | `reader@alkira.demo` | `Reader123!` | `246810` |
| Read/write | `writer@alkira.demo` | `Writer123!` | `135790` |

## How to test the login / MFA flow

1. Open `/login`.
2. Try submitting empty or malformed values to see field-level validation.
3. Sign in with either mock account.
4. Enter the matching six-digit MFA code.
5. You are redirected to `/dashboard`.
6. Compare the two roles:
   - **Read-only**: Add/Edit controls are disabled.
   - **Read/write**: Add/Edit controls are enabled; clicking Edit opens a small demo dialog.
7. Sign out and verify that `/dashboard` can no longer be accessed.

## Automated tests

```bash
npm test
```

The tests cover:

- login form validation;
- successful login + MFA;
- edit access for the read/write role;
- disabled edit access for the read-only role.

## Key design decisions and assumptions

### 1. Authentication is intentionally mocked
The exercise explicitly allows mock users and does not require backend authentication. Credentials and MFA codes therefore live in `src/mockUsers.ts`. This keeps the submission focused on UI behavior, validation, routing, state, and access-control presentation.

### 2. Authentication state is centralized
`AuthContext` owns the current authentication phase (`signed-out`, `mfa-pending`, or `authenticated`), the pending MFA user, and the authenticated user. Pages consume this API rather than duplicating authentication logic.

### 3. Routes enforce flow order
The protected dashboard is wrapped by `ProtectedRoute`. A signed-out user is redirected to `/login`, while a user who has passed password verification but not MFA is redirected to `/mfa`.

### 4. Access control is demonstrated in the UI, not treated as real security
For a real application, authorization must also be enforced by backend APIs. In this frontend-only demo, role checks determine whether edit/create controls are enabled and whether the edit dialog can be reached.

### 5. Session storage is used for refresh resilience
The mock auth state is stored in `sessionStorage` so refreshing the page does not immediately destroy the demo flow, while closing the browser tab/session naturally clears it. No sensitive production credentials should ever be stored this way.

## Limitations

- No real authentication service, token handling, backend session, or API authorization.
- Mock credentials and MFA codes are visible in the client bundle by design.
- The Sign Up flow is illustrative only and does not persist a new user.
- MFA does not actually send email/SMS/authenticator notifications.
- The edit dialog does not persist changes because the protected data is static mock data.
- Session state is simplified and is not suitable for production security.

## Project structure

```text
src/
  components/
    AppShell.tsx
    FormField.tsx
    ProtectedRoute.tsx
  context/
    AuthContext.tsx
  pages/
    DashboardPage.tsx
    LoginPage.tsx
    MfaPage.tsx
    SignupPage.tsx
  test/
    setup.ts
  App.test.tsx
  App.tsx
  mockUsers.ts
  styles.css
  types.ts
```
