# LLM.md

## Project: Underground Leak Adjustment Request Assistant

This document is a continuation brief for future LLM sessions working on this project.

It is intentionally high-signal. It should allow a fresh LLM to restore the architecture, current implementation truth, product intent, UX philosophy, known decisions, and next build targets without re-litigating the same issues.

This is not a marketing summary. It is a working handoff.

---

# 1. SYSTEM CONTEXT

## Product

This is a small React + Vite utility app that helps a Miami-Dade homeowner complete the official Miami-Dade Water & Sewer Department `Underground/Concealed Leak Adjustment Request` PDF.

The app guides the user through simple pseudo-pages, collects the data needed by the official form, captures a signature, fills the PDF client-side using `pdf-lib`, and downloads a completed PDF with a logical filename.

The product is intentionally narrow.

It is not a generalized form platform yet. It is one high-value workflow:
`underground/concealed water leak adjustment request`.

## Core Problem

Miami-Dade homeowners can receive unusually high water bills after an underground or concealed leak. The county form exists, but the process is stressful because users may not know:
- when the form applies
- what repair documents are needed
- what photos are needed
- what fields go where
- whether repairs must be complete first
- whether they are submitting to the correct agency
- how not to lose progress while filling it out

The app converts official-government-form ambiguity into a calm guided workflow.

## Target User

Primary:
- Miami-Dade homeowner
- water bill increased due to underground/concealed leak
- repair is complete or nearly complete
- has or can obtain repair invoice/statement and before/after photos
- wants to avoid mistakes
- may be on mobile
- may be stressed

Secondary future users:
- contractors helping homeowners prepare documentation
- plumbers/leak repair companies who want a customer-facing helper
- future local workflow assistants for other Miami-Dade forms

## Current Stage

This is an MVP utility app in active build/polish.

Current truth:
- Frontend-only.
- Static deploy friendly.
- PDF generation works.
- PDF coordinate placement is now mostly correct.
- Browser pseudo-navigation exists.
- Draft persistence exists or is being finalized.
- Pre-start page exists and has been simplified.
- CSS has been split because the original monolithic app.css became hard to manage.

Current focus:
- production polish
- reducing fragility
- localStorage restore behavior
- pseudo-page history behavior
- UX copy and trust clarity
- future ability to add attachment packet generation

---

# 2. CURRENT ARCHITECTURE

## Runtime Stack

- React
- TypeScript
- Vite
- pdf-lib
- plain CSS
- localStorage
- browser History API
- static files in `public/`

The app is designed to deploy as a static app, likely GitHub Pages.

No backend, database, auth, server-side rendering, or external API exists.

## Current Source Structure

Current intended structure:

```txt
src/
  App.tsx

  components/
    AccountStep.tsx
    ContactStep.tsx
    PreStartPage.tsx
    RepairStep.tsx
    ReviewStep.tsx
    SignatureStep.tsx
    StepActions.tsx
    StepErrorBox.tsx
    WorkflowHeader.tsx
    WorkflowProgress.tsx

  data/
    leakFormData.ts

  lib/
    assetPath.ts
    draftStorage.ts
    formatters.ts
    generateLeakAdjustmentPdf.ts
    validation.ts

  styles/
    base.css
    layout.css
    forms.css
    pre-start.css
    print.css
    steps/
      account-step.css
      contact-step.css
      repair-step.css
      signature-step.css
      review-step.css

  types/
    leakForm.ts
```

The official PDF lives in:

```txt
public/underground-leak-adjustment-request.pdf
```

Use `assetPath()` when referencing public assets so Vite/GitHub Pages base paths work.

## App Flow

Current flow:

1. `PreStartPage`
    - Explains what the tool does.
    - Makes clear it helps fill the official form.
    - Links to the official PDF.
    - States clearly: "We are not the Miami-Dade Government. We only help you fill out the official form."
    - Has primary CTA: start the form.

2. Account step
    - Account owner type.
    - Name on account.
    - Account number.

3. Contact step
    - Service address.
    - Mailing address.
    - "Same as service" checkbox.
    - Phone/email.
    - Address fields are split into street/city/state/zip.
    - State locked to FL.
    - Zip is 5 digits.

4. Repair step
    - Repairs completed by.
    - Date of repair.
    - Plumber license number.
    - License type.
    - Repair description.
    - Once-per-lifetime adjustment checkbox.

5. Signature step
    - Canvas signature capture.
    - Stores signature as Data URL.
    - Important: signature must be stored outside the canvas so it survives component unmounting.

6. Review step
    - Shows reminder of required supporting documents.
    - Generates completed PDF.

## Browser Navigation Model

The app uses pseudo-pages rather than React Router.

Intent:
- browser back moves to prior step
- in-app back on step 1 returns to pre-start page
- URL hashes can restore a step after reload
- no hash should show pre-start page

Current desired behavior:

```txt
/                 -> PreStartPage, but saved form data is loaded silently
/#account         -> Account step, restored draft data
/#contact         -> Contact step, restored draft data
/#repair          -> Repair step, restored draft data
/#signature       -> Signature step, restored draft data
/#review          -> Review step, restored draft data
```

Important rule:
- Do not auto-open the workflow from localStorage when there is no hash.
- Saved draft data should be preserved silently.
- Clicking Start should begin at step 1, not jump to saved currentStepIndex.
- Valid hash should open that step using saved form data/signature if available.

This was explicitly corrected after a regression where saved `hasStarted` caused root URL reloads to skip the pre-start page.

## Persistence Model

`draftStorage.ts` owns persistence.

Expected API:

```ts
loadDraft(maxStepIndex: number): StoredAppState | null
saveDraft(state: StoredAppState): void
clearDraft(): void
```

Persisted state:
- hasStarted
- currentStepIndex
- formData
- signatureDataUrl

However, `hasStarted` should not control initial screen when there is no hash. It can be stored but should be ignored by `getInitialState()` unless a valid hash exists.

Why:
- User may reload root URL and should see trust/onboarding context.
- Saved data should not be lost.
- User can click Start to resume at beginning with saved fields already present.

## PDF Generation Model

`generateLeakAdjustmentPdf.ts` is responsible for:
- loading official PDF from public asset
- embedding standard Helvetica fonts
- drawing text overlays
- drawing checkbox X marks
- drawing signature image
- downloading PDF blob

The official PDF appears not to be reliable as a fillable AcroForm, so the app overlays text and signatures by coordinate.

Important architecture:
- `TEXT_POSITIONS`
- `CHECK_POSITIONS`
- `SIGNATURE_POSITIONS`

These coordinate maps are the source of truth.

Do not scatter coordinates inline again.

Debug tool:
- `DEBUG_COORDINATES = true` renders red crosshair markers at anchor points.

This was introduced because manually tuning inline x/y values became hard to reason about.

---

# 3. CURRENT DATA MODEL

## LeakFormData

Current conceptual fields:

```ts
type LeakFormData = {
  accountOwnerType: 'self' | 'someone-else' | ''
  nameOnAccount: string
  accountNumber: string

  serviceAddress: string
  serviceCity: string
  serviceState: 'FL'
  serviceZip: string

  mailingAddressSameAsService: boolean
  mailingAddress: string
  mailingCity: string
  mailingState: 'FL'
  mailingZip: string

  homePhone: string
  cellPhone: string
  businessPhone: string
  email: string

  repairsCompletedBy: string
  dateOfRepair: string
  plumberLicenseNumber: string
  licenseType: 'state' | 'miami-dade' | ''
  repairDescription: string
  wantsLifetimeAdjustment: boolean
}
```

## Why Addresses Are Split

Originally the form had broader address strings like `cityStateZip`. This was changed.

Current decision:
- split address into discrete fields
- lock state as FL
- validate zip as 5 digits
- allow service/mailing sync

Reason:
- user guidance is clearer
- validation is possible
- PDF placement is more controllable
- future multi-form workflows will likely need structured address data

## Mailing Address Sync

`mailingAddressSameAsService` means:
- mailing fields mirror service fields
- mailing inputs should be disabled/locked in UI
- changes to service fields should update mailing fields while sync is on

Current update logic lives in App:
- `updateField()`
- `syncMailingAddress()`

This may later move to a reducer or form state helper if the app grows.

## Signature Data

Signature is stored as:
- PNG data URL string

Important historical bug:
- the signature canvas unmounted when the user moved to Review.
- `canvasRef.current` became null.
- PDF generation threw `Signature is required`.

Fixed by:
- storing `signatureDataUrl` in React state
- passing it to PDF generation
- redrawing it into SignatureStep when returning to signature page

Do not regress to relying on canvas refs from App.

## WorkflowStep

Step structure:

```ts
type StepId = 'account' | 'contact' | 'repair' | 'signature' | 'review'

type WorkflowStep = {
  id: StepId
  label: string
}
```

The `steps` array is the source of truth for:
- progress display
- validation loop
- current step IDs
- hash step restoration

---

# 4. CURRENT IMPLEMENTATION STATE

## Working / Real

### Pre-start Page
Real, functional, visually close to target. It should remain simple.

Current content direction:
- one strong hero
- two actions: start form, view official PDF
- four icon overview cards
- clear non-government notice

Do not overload this page.

### Workflow Steps
Real, functional.

### Client-Side PDF Generation
Real, functional.

### Signature Capture
Real, functional.

### Coordinate Maps
Real and now mostly correct.

Latest note from user:
- positioning now looks good.

### Draft Persistence
Implemented or in process with `draftStorage.ts`.

Important:
- persistence should not force workflow open on root URL.

### Pseudo-pages
Implemented with History API and hash.

## Partial / Needs Care

### PDF Positioning
Although user said positioning looks good, still treat as fragile because it depends on exact PDF source.

### Mobile
Basic responsive styles exist. Needs more real testing.

### Accessibility
Not deeply audited:
- buttons mostly fine
- canvas signature may need accessibility fallback later
- error messaging likely needs ARIA improvements later

### Privacy/LocalStorage UX
Persistence is useful but users may need:
- clear saved draft
- privacy explanation
- maybe "Your data stays in this browser"

Currently privacy framing exists in UI/footer.

## Placeholder / Deferred

### Plumber Referral
A side card exists or is being added:
- "Looking for a plumber in Miami? Click here"
- currently placeholder only
- should not hijack trust
- should remain optional and contextual

Do not turn it into banner ads or aggressive monetization.

### Attachment Packet Compilation
Future possibility:
- collect repair invoice/statement
- collect before/after photos
- merge into packet
- maybe generate cover sheet

Not currently implemented.

### Submission
The app does not submit to Miami-Dade.
It only generates a PDF.

---

# 5. LOCKED DESIGN DECISIONS

## Narrow Workflow First

Do not generalize prematurely.

This is not yet "all Miami-Dade forms."
It is a single workflow proving the pattern.

## Guided Questions Over Open Text

The broader product philosophy is:
- normal users get stressed converting bureaucracy into prompts/questions
- guided constrained choices reduce cognitive load
- recognition is easier than generation

The app should avoid relying on open-ended problem descriptions for the core flow.

## Trust First

The tool must repeatedly preserve trust:
- We are not Miami-Dade.
- We cannot approve adjustments.
- We only help fill out the official form.
- User submits to the agency.

Do not blur this.

## No Backend Yet

Adding backend infrastructure too early is a drift risk.

## localStorage is Enough for MVP

Persistence goal is accident recovery, not accounts.

## PreStartPage Must Stay Simple

Previous version had too much information and felt inconsistent.

Current preferred direction:
- clean modern card
- icons
- short one-sentence cards
- minimal copy
- clear CTA

## Coordinate Maps Are Locked

Use coordinate maps for PDF positions.

Do not reintroduce inline coordinate sprawl.

## CSS Split Is Locked

Do not collapse back to app.css.

Reason:
- selector collisions already caused visual bugs
- `.preStartCopy > p` accidentally overrode `.departmentPill`
- `.subSection p` caused Step 2 style leakage

Use semantic class names:
- `.preStartIntro`
- `.browserNote`
- `.heroIntro`
- `.subSectionHeader`

Avoid broad selectors like:
- `.hero p:last-child`
- `.subSection p`
- `.preStartCopy > p`

---

# 6. REJECTED PATHS

## Monolithic CSS

Rejected.

Why:
- hard to reason about
- broad selectors caused bugs
- future steps will compound complexity

## React Router

Not needed yet.

Why:
- app is simple
- GitHub Pages static deployment
- History API + hash is sufficient

Only revisit if:
- multiple independent forms/workflows are added
- URLs need direct routing beyond simple hash step restoration

## Auto-Resume Workflow on Root URL

Rejected.

Bad behavior:
- user reloads `/` and skips pre-start page because saved `hasStarted=true`.

Correct behavior:
- no hash shows PreStartPage
- saved form data still loads silently
- user clicks Start to continue at step 1

## Over-Explaining Requirements

Rejected.

The user repeatedly preferred:
- one sentence
- direct language
- icons
- less information at once

## Aggressive Contractor Lead Gen

Rejected as initial framing.

Allowed:
- optional contextual card
- user-invoked
- clearly separate from form guidance

Not allowed:
- interruptive ads
- routing users toward monetized referrals
- making contractor help feel required

---

# 7. KNOWN IMPERFECTIONS

## Sample Data Still Used

The app currently uses `sampleLeakFormData` for easier debugging.

Before launch:
- replace fallback/defaults with `initialLeakFormData`
- remove hidden/debug sample behavior

The user currently wants sample data assumed for now.

## Storage Privacy

Signature is stored in localStorage.
This is convenient but potentially sensitive.

Future:
- add "Clear saved draft"
- possibly warn user that signature persists locally

## Browser History Edge Cases

Current approach is lightweight.

Known possible issues:
- repeated pushState entries if user navigates many steps
- manual hash edits
- back behavior around intro/workflow boundary
- reload and history state mismatch

Accepted for MVP.

## PDF Position Fragility

Manual coordinate overlay depends on:
- exact PDF asset
- page size
- font size
- PDF viewer rendering

If the PDF changes, positions must be revalidated.

## Plumber Card Placeholder

Do not pretend matching exists.

Should be either:
- disabled
- alert placeholder
- "Coming soon"

Until real.

---

# 8. NEXT BUILD TARGET

## Immediate Next Objective

Finish hardening the persisted pseudo-page workflow.

Expected behavior:
- `/` loads PreStartPage.
- `/#account` loads Account step.
- `/#contact` loads Contact step.
- `/#repair` loads Repair step.
- `/#signature` loads Signature step.
- `/#review` loads Review step.
- Saved form fields restore in all cases.
- Saved signature restores if available.
- Start button begins at Account step.
- Back button on Account returns to PreStartPage.
- Browser back follows prior step history.
- Reset clears draft, signature, and returns to Account step after confirmation.

## Then

1. Confirm PDF output with current coordinates.
2. Add subtle "saved locally" reassurance if needed.
3. Add "clear saved draft" option.
4. Improve mobile view.
5. Prepare production mode by removing sample defaults.
6. Optional: add invoice/photo packet attachment compilation.

---

# 9. CRITICAL IMPLEMENTATION NOTES

## App.tsx Responsibilities

App currently owns:
- high-level workflow state
- history integration
- persistence effect
- field update routing
- step rendering
- PDF generation call

This is acceptable for now but close to becoming too large.

If it grows again, extract:
- `useWorkflowHistory`
- `useLeakDraft`
- `useLeakFormState`

Do not prematurely abstract unless App becomes painful again.

## draftStorage.ts Rules

`draftStorage.ts` should not decide navigation behavior.

It should only:
- load draft data
- save draft data
- clear draft data

`App.tsx` decides:
- whether hash means open workflow
- whether root shows intro

## getInitialState() Correct Logic

Correct logic:

```txt
savedDraft = loadDraft()
hashStep = current hash

if hashStep is valid:
  hasStarted = true
  currentStepIndex = hashStep index
  formData = savedDraft.formData or sample/initial
  signatureDataUrl = savedDraft.signatureDataUrl or ''

else:
  hasStarted = false
  currentStepIndex = savedDraft.currentStepIndex or 0
  formData = savedDraft.formData or sample/initial
  signatureDataUrl = savedDraft.signatureDataUrl or ''
```

Do NOT restore `hasStarted` from localStorage when no hash exists.

## History State

History state shape:

```ts
type AppHistoryState = {
  screen: 'intro' | 'workflow'
  stepId?: StepId
}
```

## Plumber License Placeholder

Florida plumbing contractor license examples:
- `CFC1234567` for Certified Plumbing Contractor
- `RF1234567` for Registered Plumbing Contractor

Most likely placeholder:
```tsx
placeholder="Example: CFC1234567"
```

## Official Form Requirements

Based on the PDF:
- completed and signed adjustment request form
- invoice or repair statement
- before/after pictures
- repairs final
- submit within 30 days after notification
- the department may verify repairs
- request may take up to 60 days
- there is a $30 administrative processing fee
- once-per-lifetime 100% concealed leak adjustment requires signature

Keep user-facing copy short, but do not contradict these requirements.

---

# 10. USER MENTAL MODEL

## User Believes

"I have a high water bill because of a leak, and this tool helps me fill out the official Miami-Dade form correctly."

## User Must Not Believe

- that this app is Miami-Dade
- that this app submits the form automatically
- that approval is guaranteed
- that contractor referral is required
- that data is being stored on a server

## Success Feeling

The user should feel:
- guided
- calm
- not stupid
- not trapped
- like the PDF is ready
- like they know what to submit with it

## UX Anchors

Use:
- icons
- one-sentence cards
- clear CTAs
- visible progress
- short disclaimers
- calm blue/white visual system

Avoid:
- long paragraphs
- legalese
- government-document density
- complex branching too early

---

# 11. CODE GENERATION RULES

## User Preference

The user prefers:
- full replacement code when changes are localized
- exact paste-ready snippets
- file path comment at top of code snippets
- no vague instructions when code is needed
- Potential Problems section for generated code
- concise but complete explanations

## Comment System

When adding comments, use:
- `#` for structural sections
- `▶` for high-level flow/story
- `§` sparingly for critical constraints

Only apply when useful.

## Style

- Avoid em dashes.
- Use straight quotes.
- Avoid hype.
- Avoid generic "robust platform" language.
- Keep copy plain and human.

## CSS

- Keep split CSS structure.
- Use semantic classes.
- Avoid broad positional selectors.
- Avoid Tailwind.
- Avoid over-specific hacks unless needed.

## React

- Keep components focused.
- Avoid introducing context/reducers until needed.
- Do not add React Router unless the project expands beyond simple hash pseudo-pages.
- Avoid hidden magic.

## PDF

- Keep coordinates centralized.
- Keep debug markers available.
- Avoid fancy auto-detection unless explicitly requested.
- Test output after coordinate changes.

---

# CURRENT PRIORITY

## Single Most Important Build Objective

Make the draft persistence + pseudo-page navigation behavior correct and predictable while preserving the pre-start page as the root experience.

## Main Architectural Risk

Letting a narrow static utility app turn into a generalized, backend-heavy, route-heavy platform too early.

## What Not To Get Distracted By

- generalized form search
- AI matching
- backend accounts
- contractor marketplace
- analytics dashboards
- automatic submission
- broad Miami-Dade form library

The winning wedge right now is one clean workflow that works.
