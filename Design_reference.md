# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations

**Avoid:** Plain solid colors or static images, and gradient color for texts.

### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Autopilot Studio - Development Blueprint

Autopilot Studio is a unified business OS for AI development agencies and teams, automating the entire service pipeline from intake through project handover and post-launch support. It streamlines lead qualification, proposal/contract generation, project setup, repository and deployment integrations, billing, time tracking, and success measurement—all with built-in AI copilots for requirements, specs, and feedback synthesis. The platform targets AI/ML consultancies, dev agencies, and technical program managers, offering a branded, auditable, and operationally efficient experience.

---

## 1. Pages (UI Screens)

### 1. Login / Signup
- **Purpose:** Authentication gateway for users/clients; entry to main app.
- **Key Sections/Components:**
  - Header: Logo, language selector, support link
  - Auth Form: Email, password, "Continue with SSO", social logins (Google, GitHub)
  - "Remember me" checkbox
  - Signup Options: Team/individual, company name, role selector
  - Guest Intake CTA: Book intake (creates temp prospect record)
  - Primary CTA Buttons: Sign up, Log in
  - Links: Password reset, email verification info
  - Security Notices: 2FA toggle info

### 2. Password Reset
- **Purpose:** Secure password recovery for users.
- **Key Sections/Components:**
  - Request Form: Email input, submit
  - OTP Entry (optional): 6-digit code input
  - New Password Form: New + confirm fields, strength meter
  - Success Screen: Confirmation, login link
  - Validation & Error States

### 3. Email Verification
- **Purpose:** Guide users to verify email; show/resend status.
- **Key Sections/Components:**
  - Verification Status Message: Pending/verified
  - Resend Button
  - Support Link
  - Continue CTA

### 4. Landing Page
- **Purpose:** Public-facing marketing; value proposition and lead capture.
- **Key Sections/Components:**
  - Hero: Headline, subheadline, primary CTA (Book AI Intake), secondary CTA (Request Demo), illustration
  - Features Grid: Intake, proposals, scaffolding, copilot, automation, billing
  - Integrations: Logos (GitHub, Vercel, etc.)
  - Use Cases & Testimonials
  - Pricing Teaser
  - Footer: Legal, contact, socials

### 5. Dashboard
- **Purpose:** User workspace overview and quick navigation.
- **Key Sections/Components:**
  - Top Bar: Search, notifications, avatar, global create
  - Pipeline Cards: Leads → Proposals → Projects → Completed
  - Active Projects List: Progress, next milestone, assignees, links
  - AI Copilot Panel: Suggested actions, summaries
  - Calendar Widget: Meetings, sync status
  - Financial Snapshot: MRR, invoices, billing
  - Recent Activity Feed
  - Quick Actions: New intake, proposal, spin up, launch

### 6. AI-Assisted Intake (Booking)
- **Purpose:** Guided AI intake for prospect qualification and project capture.
- **Key Sections/Components:**
  - Booking Calendar: Slot selection or instant form
  - AI Intake Chat/Form: Adaptive Q&A (goals, budget, stack, etc.)
  - Qualification Bar: Auto-score, suggested next steps
  - Attach Files: Docs, repo links
  - Privacy Notice/Consent
  - CTA: Submit & Generate Proposal

### 7. Proposals & SoW
- **Purpose:** Central area for proposal/SoW generation, signature, and approval.
- **Key Sections/Components:**
  - Proposal List: Table with status, client, value
  - Proposal Viewer/Editor: Rich editor, AI-suggested blocks, scope templates
  - SoW Templates Library
  - E-sign Flow: Send, reminders, audit trail
  - Version History & Comments
  - Generate (AI): Regenerate option

### 8. Project Space
- **Purpose:** Project-specific workspace post-contract for execution.
- **Key Sections/Components:**
  - Project Header: Title, client, status
  - Milestones Timeline: Acceptance criteria, billing triggers
  - Task Board: Kanban/list, assignments
  - Repo Integrations Panel: Connect, map, branch/PR status
  - Client Portal Link (preview)
  - AI Copilot Sidebar: Generate specs, notes, CRs
  - Files & Assets: Shared docs, Looms, handover
  - Audit Log

### 9. Client Portal
- **Purpose:** Client-facing view for updates, approvals, and shared resources.
- **Key Sections/Components:**
  - Project Summary
  - Deliverables Feed: Approval controls, diff viewer
  - Feedback Capture: Structured form
  - Shared Assets: Docs, Looms
  - Support Chat/Contact

### 10. AI Copilot Workspace
- **Purpose:** Dedicated AI artifact generation and workflow.
- **Key Sections/Components:**
  - Copilot Prompt Console: Custom/preset input
  - Drafts List: Artifact types, statuses
  - Approval Workflow: Reviewer assignment, review state
  - Tokens & Usage Meter
  - Audit & Versioning

### 11. Repository Integrations
- **Purpose:** Connect and manage code repositories and deployments.
- **Key Sections/Components:**
  - Integration List: Connected accounts, repos
  - Connect Button (OAuth)
  - Repo Mapping UI
  - Webhook Status & Logs
  - Commit/PR Feed

### 12. Standups & Status Reports
- **Purpose:** Automate standups/status, distribute to teams.
- **Key Sections/Components:**
  - Standup Settings: Cadence, participants
  - Auto-summary Feed
  - Status Reports Scheduler
  - Report Builder: Editable, commit/issue sections
  - Send/Archive Controls

### 13. Launch Checklist & Deployment
- **Purpose:** QA, security, deployment management for launches.
- **Key Sections/Components:**
  - Checklist Items: QA/security/performance
  - Deployment Integrations: Vercel, Cloudflare, AWS
  - Automated Tests Runner
  - Release Notes Composer
  - Stakeholder Scheduler
  - Launch Controls: Dry-run, go/no-go

### 14. Billing & Invoicing
- **Purpose:** Manage milestone billing, time tracking, QuickBooks sync, and financials.
- **Key Sections/Components:**
  - Milestone Billing Table
  - Time Tracking Integration
  - Invoice List: Actions, status
  - QuickBooks Sync Panel
  - Profit Analytics
  - Payment Methods & Checkout

### 15. Time Tracking
- **Purpose:** Time entry, reporting, and billing integration.
- **Key Sections/Components:**
  - Timer Controls
  - Timesheet View
  - Billable Toggle & Rates
  - Export/Sync
  - Reports

### 16. Handover Pack
- **Purpose:** One-click generation of project deliverables and post-launch plans.
- **Key Sections/Components:**
  - Handover Generator: Asset selection
  - Included Assets: Docs, runbooks, Looms
  - One-click Export: ZIP, PDF, hosted
  - SLA & Success Plan
  - Delivery Log

### 17. Settings / Preferences
- **Purpose:** Manage account, workspace, branding, integrations, team, and notifications.
- **Key Sections/Components:**
  - Workspace Settings
  - Team Management
  - Integrations Panel
  - AI & Billing
  - Notifications
  - Security
  - Audit Logs

### 18. Admin Dashboard
- **Purpose:** Workspace/multi-tenant admin controls and analytics.
- **Key Sections/Components:**
  - User Management
  - Workspace Metrics
  - Integration Health
  - Audit Logs
  - Support Tools

### 19. About / Help
- **Purpose:** Product docs, API, tutorials, support.
- **Key Sections/Components:**
  - Docs Index
  - Tutorials & Videos
  - API Docs
  - FAQ
  - Contact Support
  - Release Notes

### 20. Checkout / Payment
- **Purpose:** Subscription/add-on purchase and payment.
- **Key Sections/Components:**
  - Plan Selector
  - Add-on Selector
  - Payment Form
  - Invoice Preview
  - Success & Receipt Page

### 21. Order / Transaction History
- **Purpose:** View and manage all payment/subscription events.
- **Key Sections/Components:**
  - Transactions Table
  - Filters
  - Invoice Viewer
  - Export

### 22. Create / Edit Content
- **Purpose:** CMS/editor for templates (SoW, email, onboarding).
- **Key Sections/Components:**
  - Rich Text Editor
  - Template Library
  - Preview & Test
  - Versioning

### 23. Privacy Policy
- **Purpose:** Legal data handling and user rights.
- **Key Sections/Components:**
  - Policy Text
  - Data Subject Rights: Contact/request forms
  - Download

### 24. Terms of Service
- **Purpose:** Legal terms for service use.
- **Key Sections/Components:**
  - TOS Text
  - Accept CTA

### 25. Cookie Policy
- **Purpose:** Cookie usage and consent management.
- **Key Sections/Components:**
  - Policy Details
  - Consent Manager Link

### 26. 404 Not Found
- **Purpose:** Friendly not-found page with navigation.
- **Key Sections/Components:**
  - Message
  - Search
  - CTAs

### 27. 500 Server Error
- **Purpose:** Server error page with retry/support.
- **Key Sections/Components:**
  - Message
  - Retry Button
  - Support Link

### 28. Loading / Success
- **Purpose:** Loading/progress and success confirmation.
- **Key Sections/Components:**
  - Spinner & Progress Bar
  - Success Banner with Next Steps
  - Inline Logs (long jobs)

---

## 2. Features

### 1. User Authentication & Security
- **Details:**
  - JWT access/refresh tokens with rotation
  - Secure password hashing (bcrypt/argon2)
  - Email verification with expiring tokens/resend throttle
  - Password reset via expiring token/OTP
  - SSO (SAML/OIDC) and OAuth (Google, GitHub)
  - 2FA (TOTP), device/session listing, revoke sessions
- **Implementation Notes:**
  - Use HTTPS everywhere; secure cookies for refresh tokens
  - RBAC for all protected routes
  - Audit log for auth/security events

### 2. AI-Assisted Intake & Qualification
- **Details:**
  - Conversational UI with branching and LLM-generated follow-ups
  - Qualification scoring (rules + optional ML model)
  - Calendar integration (Google/Microsoft, read/write)
  - Guest booking (no login, prospect record)
  - File/repo upload, privacy/consent capture
- **Implementation Notes:**
  - Store structured intake as prospect record
  - Summarize intake with LLM for proposal seeding

### 3. Proposal & SoW Generation + E-sign
- **Details:**
  - Template engine (placeholders, conditionals)
  - LLM for draft/re-generation
  - Rich editor with tracked changes/versioning
  - E-sign via DocuSign/HelloSign (webhook for status)
  - Reminder scheduler, audit trail
- **Implementation Notes:**
  - Store documents in object storage
  - Version proposals/SoWs for compliance

### 4. Project Scaffolding & Templates
- **Details:**
  - Library of milestone/task templates (variable substitution)
  - Automated creation of project record, permissions, timeline
  - Repo/CI/CD mapping
  - Background job orchestration for setup
  - Audit log and notifications
- **Implementation Notes:**
  - Use job queue for initialization (e.g., Sidekiq, BullMQ)

### 5. Repository Sync & Commit Analysis
- **Details:**
  - OAuth with GitHub/GitLab/Bitbucket
  - Webhook receiver for commits/PRs, CI status
  - Mapping from commits/PRs to tasks via branch/PR data
  - Commit/PR caching, delta detection, rate-limit handling
- **Implementation Notes:**
  - Backoff/retry for API limits
  - Secure scoped tokens, audit webhook events

### 6. AI Copilot Artifacts & Workflow
- **Details:**
  - LLM orchestration (specs, criteria, CRs, notes, test cases)
  - Versioning, provenance metadata
  - Convert artifacts to tasks/milestones
  - Approval workflow (reviewers, comments)
  - Moderation, PII redaction
- **Implementation Notes:**
  - Store LLM inputs/outputs for traceability
  - Permissioned access to artifacts

### 7. Meeting Notes & Transcription
- **Details:**
  - Zoom/Google Meet integration, transcript upload
  - Speech-to-text pipeline
  - LLM summary: decisions, action items, owners
  - Convert action items to tasks
  - Retention/access controls
- **Implementation Notes:**
  - Store transcripts securely; redact PII as needed

### 8. Client Feedback Synthesis
- **Details:**
  - Collect feedback (portal, email, Slack)
  - LLM to distill into tickets (priority, criteria)
  - Link tickets to project/version artifacts
  - Human review before ticket creation
- **Implementation Notes:**
  - Track feedback provenance and reviewer actions

### 9. Launch Automation & Release Notes
- **Details:**
  - Checklist engine for QA, security, perf
  - Integrations: Vercel, Cloudflare, CI for deploy/monitor
  - Release notes auto-generated from commits/PRs
  - Comms scheduler (email/Slack)
  - Rollback/emergency stop controls
- **Implementation Notes:**
  - Use provider APIs for deploys/status
  - Log all launch actions for audit

### 10. Billing, Invoicing & QuickBooks Sync
- **Details:**
  - Invoice engine (milestone/time triggers)
  - Stripe for payments/webhooks
  - QuickBooks Online API sync
  - Profit analytics (costs, time, margin)
  - Retry/reconciliation for sync failures
- **Implementation Notes:**
  - Store all invoice/payment actions with audit trail
  - Allow manual reconciliation for failed syncs

### 11. Time Tracking
- **Details:**
  - Timer backend (start/stop, conflict detection)
  - Timesheet CRUD, export
  - Billable rates, rounding
  - Link time to invoices/QuickBooks
- **Implementation Notes:**
  - Prevent overlapping entries
  - Ensure time entries have audit records

### 12. Notifications & Alerts
- **Details:**
  - Notification channels: email, in-app, Slack, webhook
  - User preferences per channel/event
  - Retry/backoff for delivery
  - Templating for messages
- **Implementation Notes:**
  - Store notification delivery status for troubleshooting

### 13. Admin & Audit
- **Details:**
  - RBAC model (fine-grained)
  - Audit logging (user, security, config events)
  - Impersonation with audit trail
  - Bulk user/role management
- **Implementation Notes:**
  - Secure admin endpoints with extra 2FA

### 14. Template & Content Management
- **Details:**
  - Template storage (variables, conditionals)
  - Versioning, preview, test-send
  - Role-based permissions
  - API for programmatic use
- **Implementation Notes:**
  - Store template usage history for compliance

### 15. Data Export / Import
- **Details:**
  - Export: Handover Pack (ZIP/PDF), analytics (CSV), invoices
  - Import: Projects, users (validation)
  - Background jobs for large exports
  - Notification on completion
- **Implementation Notes:**
  - Secure temp URLs for download; log all exports/imports

### 16. Performance Monitoring & Backup
- **Details:**
  - App/infrastructure monitoring, metrics, alerts
  - Central logs (Sentry/Logstash)
  - Daily encrypted backups, retention
  - DR drills, recovery procedures
- **Implementation Notes:**
  - Test restores regularly, document DR runbooks

---

## 3. User Journeys

### A. Prospect/Client
1. Arrives on Landing Page → Clicks "Book AI Intake" or "Request Demo"
2. Completes AI-Assisted Intake (as guest or with account)
3. Receives status (qualified/proposal sent/schedule call)
4. Reviews proposal (e-signs if ready)
5. Accesses Client Portal for updates, deliverables, and feedback
6. Approves/rejects deliverables, provides feedback (auto-synthesized into tickets)
7. Receives invoices, pays via checkout
8. Receives Handover Pack at project completion
9. Engages with SLA bot for post-launch support

### B. Sales/BD Rep
1. Logs in (SSO/social/email)
2. Views Dashboard: pipeline status, new intakes
3. Reviews/edits AI-generated proposals and SoWs
4. Sends for e-signature, tracks status/reminders
5. On proposal acceptance, triggers project scaffolding
6. Monitors pipeline, follows up on leads

### C. Project Manager
1. Logs in; sees Dashboard of active projects/milestones
2. Navigates to Project Space, reviews milestones/tasks
3. Assigns tasks, syncs calendar, configures notifications
4. Uses AI Copilot to generate/approve specs, acceptance criteria, change requests
5. Schedules/joins meetings, reviews AI-minutes/action items
6. Tracks status reports, reviews launch checklist, triggers deployment
7. Oversees billing & invoicing, monitors profitability

### D. Engineer/QA/Security
1. Logs in; views assigned tasks, meetings, repo links
2. Starts/stops time tracking, updates task status
3. Connects/syncs repositories, reviews commit/PR mapping
4. Participates in standups/status reports (auto-generated)
5. Runs QA/security launch checklist, reviews test results
6. Posts/receives release notes and deployment notifications

### E. Finance/Accounting
1. Logs in to Billing/Finance portal
2. Reviews invoices, payments, outstanding items
3. Syncs with QuickBooks, resolves sync errors
4. Exports financial reports, reviews profit analytics
5. Manages payment methods, subscriptions

### F

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in HSL format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
