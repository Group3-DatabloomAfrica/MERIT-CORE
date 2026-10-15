# MERIT-CORE — Project Plan

> **Purpose:** Track planned work, implementation progress, and testing for MERIT-CORE. Keep this file separate from `README.md`.
>
> **Project approach:** One responsive web application/PWA with role-specific experiences. The student experience is mobile-first; employer and administration dashboards are desktop-first but must remain usable on mobile and tablet.

## Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed and tested
- `[!]` Blocked / needs a decision

**Rule:** Mark an item `[x]` only after its implementation has been tested. Do not treat a screen that merely renders as a completed feature.

## 1. Project foundation and audit

- [ ] Review the current frontend structure, routes, components, styling setup, and installed packages.
- [ ] Review the current backend structure, Express routes, middleware, and error handling.
- [ ] Review PostgreSQL schema, migrations, foreign keys, indexes, and existing data.
- [ ] Verify frontend-to-backend API configuration and environment variables.
- [ ] Confirm email verification works from registration through receipt of the email and successful verification.
- [ ] Record what already exists, what works, and what still needs implementation.
- [ ] Keep secrets out of source control; check `.env` files and `.gitignore`.

## 2. Roles and permission model

### Intended user experiences

- [ ] **Student / Graduate:** Manage a career profile, discover opportunities, save listings, and manage reminders.
- [ ] **Employer:** Manage an organization profile and its opportunity listings; access relevant talent or application features that are included in scope.
- [ ] **Company Admin:** Manage their own organization's details, authorized company members, and organization-level activity.
- [ ] **Platform Admin:** Oversee the whole platform, accounts, organization verification, listing moderation, reports, and platform settings.
- [ ] **University Admin (optional / confirm scope):** Manage only permitted university-related records and functions if required.

### Permission and data-model decisions

- [ ] Decide whether `graduate` is a distinct account role or a student profile/status.
- [ ] Decide how company admins are represented. Prefer organization membership/roles if a user can belong to an organization, rather than treating company admins as platform admins.
- [ ] Reconcile the intended roles with the existing `users.role` constraint and database schema.
- [ ] Create a role-permission matrix for pages, API endpoints, and data access.
- [ ] Enforce authorization in backend middleware and route handlers; hiding frontend links alone is not security.
- [ ] Ensure company users can only manage organizations and records they are authorized to access.
- [ ] Restrict platform-admin privileges to explicitly authorized accounts; never allow public self-registration as platform admin.

## 3. Product and interface design

- [ ] Select and adapt responsive Figma references for the student, employer/company, and platform-admin experiences.
- [ ] Define shared design tokens: colors, typography, spacing, buttons, form controls, cards, and feedback states.
- [ ] Define the shared app shell, navigation, page layouts, loading states, empty states, and error states.
- [ ] Design responsive behavior for mobile, tablet, and desktop.
- [ ] Design accessible forms, keyboard navigation, focus indicators, labels, and readable contrast.
- [ ] Confirm which navigation items and actions each role should see.

## 4. Frontend foundation and PWA

- [ ] Confirm React Router route structure and protected-route behavior.
- [ ] Confirm the styling system works consistently in development and production builds.
- [ ] Add reusable layout, navigation, form, modal/dialog, notification, and data-display components.
- [ ] Configure Vite PWA support.
- [ ] Add a valid web app manifest, app name, theme colors, and appropriate icon assets.
- [ ] Configure and test the service worker and installability.
- [ ] Cache only appropriate static assets and explicitly safe data; do not cache sensitive authenticated responses by default.
- [ ] Provide sensible offline messaging and graceful recovery when the API is unavailable.
- [ ] Test installation and update behavior on supported browsers/devices.

## 5. Authentication and account security

- [ ] Complete registration validation and duplicate-email handling.
- [ ] Complete email verification, expiry handling, and a way to request a new verification email if needed.
- [ ] Complete login, logout, and session/token handling.
- [ ] Add password reset flow if included in project scope.
- [ ] Add backend authentication and role/permission middleware.
- [ ] Protect private frontend routes and handle expired/invalid sessions.
- [ ] Validate and sanitize incoming data; use parameterized database queries.
- [ ] Add rate limiting and safe error responses to sensitive authentication endpoints.
- [ ] Test unverified users, invalid credentials, expired tokens, and unauthorized role access.

## 6. Student / Graduate experience

- [ ] Build student/graduate dashboard.
- [ ] Build and edit career profile: biography, institution, degree, field of study, graduation year, skills, interests, and profile photo URL if supported.
- [ ] Browse and search opportunities.
- [ ] Add filters such as opportunity type, location, and deadline where supported by the data model.
- [ ] View opportunity details and application instructions.
- [ ] Save and unsave opportunities.
- [ ] Create, view, edit, and remove reminders where supported.
- [ ] Add profile and opportunity empty/loading/error states.
- [ ] Test student permissions and responsive layouts.

## 7. Employer / Company experience

- [ ] Build employer dashboard.
- [ ] Create and edit an organization profile.
- [ ] Submit organization verification information and display verification status.
- [ ] Create, edit, publish, close, and manage opportunity listings, subject to verification and moderation rules.
- [ ] Show only opportunities belonging to the authorized organization.
- [ ] Decide whether applications are handled inside MERIT-CORE or through external `application_url` links.
- [ ] If in-platform applications are in scope, design the application data model and workflow before implementation.
- [ ] Add organization activity and opportunity status summaries.
- [ ] Test company-level permissions and responsive layouts.

## 8. Company Admin experience

- [ ] Define company-admin permissions separately from platform-admin permissions.
- [ ] Build organization-member management if multiple users can belong to a company.
- [ ] Allow authorized company admins to update their organization's profile and manage organization-level access.
- [ ] Ensure company admins cannot view or modify other organizations' private records.
- [ ] Test company-admin access boundaries.

## 9. Platform Admin experience

- [ ] Build a separate protected platform-admin dashboard and navigation.
- [ ] Show platform overview metrics based on real database data.
- [ ] List, search, filter, and inspect user accounts.
- [ ] Provide safe account status actions, such as suspending/reactivating accounts, with confirmation and audit records.
- [ ] Review and approve/reject organization verification requests.
- [ ] Review, approve/reject, close, or remove opportunity listings according to defined moderation rules.
- [ ] Manage organization records and investigate user reports if reports are in scope.
- [ ] Add platform settings only for settings that are actually implemented and persisted.
- [ ] Record sensitive administrative actions in an audit log.
- [ ] Require confirmation for destructive or high-impact actions.
- [ ] Test that non-admin users cannot access admin pages or admin APIs directly.

## 10. Database and backend support

- [ ] Align migrations and schema with the confirmed role and organization-membership model.
- [ ] Add missing constraints, indexes, and timestamps where justified.
- [ ] Implement and validate API endpoints for each agreed feature.
- [ ] Use consistent response shapes and centralized error handling.
- [ ] Add pagination/filtering for large admin and opportunity lists.
- [ ] Use transactions for multi-step database changes where needed.
- [ ] Ensure admin actions and account-status changes are auditable.
- [ ] Test API validation, authorization, and database failure paths.

## 11. Quality assurance and accessibility

- [ ] Test key user journeys for every role.
- [ ] Test direct URL access and API requests with the wrong role.
- [ ] Test mobile, tablet, and desktop layouts.
- [ ] Test forms, validation messages, loading states, empty states, and errors.
- [ ] Test PWA installation, offline messaging, and update behavior.
- [ ] Check accessibility: labels, keyboard use, focus order, contrast, and semantic structure.
- [ ] Check browser console and backend logs for errors.
- [ ] Run production build and fix build warnings/errors that affect the app.
- [ ] Review dependency/security warnings and remove unused packages where appropriate.

## 12. Deployment and documentation

- [ ] Configure production frontend and backend environment variables.
- [ ] Configure production PostgreSQL and apply migrations safely.
- [ ] Configure email delivery and test verification emails in the deployed environment.
- [ ] Configure HTTPS, allowed origins/CORS, and secure production settings.
- [ ] Document local setup, environment variables, migrations, scripts, and deployment steps in `README.md`.
- [ ] Keep this `PROJECT_PLAN.md` as the progress tracker and update it after each verified milestone.
- [ ] Perform a final smoke test of student, employer/company, and platform-admin workflows.

## Suggested implementation order

1. Audit the current code and database.
2. Confirm roles, company membership, and permission matrix.
3. Choose/adapt Figma designs and establish the shared responsive design system.
4. Stabilize authentication and authorization.
5. Build the student opportunity/profile workflow.
6. Build employer and company-admin workflows.
7. Build platform-admin tools and audit logging.
8. Add and test PWA behavior.
9. Complete cross-role, responsive, security, and deployment testing.

## Progress notes

Add dated notes here when a milestone is verified. Include what changed, what was tested, and any remaining issues.

- _No milestones recorded yet._
