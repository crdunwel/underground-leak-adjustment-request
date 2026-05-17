# LLM.md

## Project: Underground Leak Adjustment Request Assistant

This document is a continuation brief for future LLM sessions working on this project.

It is intentionally high-signal. It should allow a fresh LLM to restore the architecture, current implementation truth, product intent, UX philosophy, known decisions, and next build targets without re-litigating the same issues.

This is not a marketing summary. It is a working handoff.

---

# 1. SYSTEM CONTEXT

## Product

This is a small React + Vite static utility app that helps a Miami-Dade homeowner prepare the official Miami-Dade Water & Sewer Department `Underground/Concealed Leak Adjustment Request` submission packet.

The app guides the user through simple pseudo-pages, collects the data needed by the official form, captures a signature, fills the official PDF client-side using `pdf-lib`, collects required supporting documents, and downloads a completed PDF packet.

The current product is intentionally narrow.

It is not a generalized form platform. It is one high-value workflow:

```txt
underground / concealed water leak adjustment request packet
```

## Core Problem

Miami-Dade homeowners can receive unusually high water bills after an underground or concealed leak. The county form exists, but the process is stressful because users may not know:

- when the form applies
- what repair documents are needed
- what photos are needed
- how to document repair location clearly
- what fields go where
- whether repairs must be complete first
- whether the Department may need to verify repairs
- whether they are submitting to the correct agency
- how not to lose progress while filling it out
- how to combine form + photos + invoices into a coherent packet

The app converts official-government-form ambiguity into a calm guided workflow.

## Target User

Primary:

- Miami-Dade homeowner
- water bill increased due to underground or concealed leak
- repair is complete or nearly complete
- has or can obtain repair invoice/statement and before/after photos
- may be older, scared, rushed, non-technical, and on mobile
- wants to avoid mistakes and rejection

Secondary future users:

- contractors helping homeowners prepare documentation
- plumbers/leak repair companies who want a customer-facing helper
- future local workflow assistants for other Miami-Dade forms

## Current Stage

This is an MVP utility app in active build/polish.

Current truth:

- Frontend-only.
- Static deploy friendly.
- Repository exists at `git@github.com:crdunwel/underground-leak-adjustment-request.git`.
- Intended public URL is `https://miamileakadjustment.com/`.
- MIT licensed via root `LICENSE` file.
- PDF generation works.
- Official PDF coordinate placement is mostly correct.
- Packet generation now exists: official completed form + summary page + photo pages + merged PDFs + image document pages.
- Browser pseudo-navigation exists via hash-style route model.
- Form draft persistence uses `localStorage`.
- Uploaded files persist separately using IndexedDB through `draftStorage.ts` upload helpers.
- Pre-start page exists and has been simplified.
- Terms page exists as a pseudo-route.
- CSS is split by concern because the original monolithic `app.css` became fragile.

Current focus:

- production polish
- copy clarity and trust boundaries
- packet generation reliability
- mobile behavior
- reducing user confusion around upload requirements
- keeping the workflow narrow and low-friction

---

# 2. CURRENT ARCHITECTURE

## Runtime Stack

- React
- TypeScript
- Vite
- `pdf-lib`
- `heic2any` for HEIC/HEIF conversion
- plain CSS
- `localStorage` for lightweight draft state
- IndexedDB for uploaded file persistence
- browser History API + hash pseudo-routes
- static files in `public/`

The app is designed to deploy as a static app on GitHub Pages.

No backend, database server, auth, server-side rendering, or external API exists.

## Current Source Structure

Current intended structure:

```txt
src/
  App.tsx

  components/
    AccountStep.tsx
    ContactStep.tsx
    InvoiceStep.tsx
    PhotosStep.tsx
    PreStartPage.tsx
    RepairStep.tsx
    RequirementsStep.tsx
    ReviewStep.tsx
    SignatureStep.tsx
    StepActions.tsx
    StepErrorBox.tsx
    SupportingDocsStep.tsx
    WorkflowHeader.tsx
    WorkflowProgress.tsx

  data/
    leakFormData.ts

  lib/
    appRouter.ts
    assetPath.ts
    draftStorage.ts
    fileHelpers.ts
    formatters.ts
    generateLeakAdjustmentPdf.ts
    imageConversion.ts
    validation.ts

  pages/
    TermsPage.tsx

  styles/
    base.css
    layout.css
    forms.css
    pre-start.css
    terms.css
    print.css
    steps/
      account-step.css
      contact-step.css
      document-step.css
      repair-step.css
      requirements-step.css
      review-step.css
      signature-step.css

  types/
    heic2any.d.ts   # only needed if TS complains about heic2any types
    leakForm.ts
```

The official PDF lives in:

```txt
public/underground-leak-adjustment-request.pdf
```

Use `assetPath()` when referencing public assets so Vite/GitHub Pages base paths work.

## Current App Flow

Current workflow steps:

1. `PreStartPage`
   - Explains what the tool does.
   - Makes clear it helps fill out the official form.
   - Links to the official PDF.
   - States clearly that the app is not Miami-Dade government.
   - Has primary CTA: start the form.

2. Account step
   - Account owner type.
   - Name on account.
   - Account number.
   - Choice cards now show stronger selected state: light blue interior + checkmark.

3. Contact step
   - Service address.
   - Mailing address.
   - `Same as service` checkbox.
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
   - Checkbox card now has white background + soft blue border before click, blue-soft fill after click.
   - `What is this?` details are placed below the checkbox card so users do not accidentally click it while selecting the card.

5. Requirements step
   - Explains the upcoming packet-building steps in calm plain English.
   - Purpose is preview/orientation, not a scary legal checklist.
   - Explains that the user will add photos, invoice/statement, optional supporting documents, then sign and download one packet.
   - Includes a short important notice: repairs should be complete, take photos before covering when relevant, Miami-Dade may verify repair.

6. Photos step
   - Upload any number of repair photos.
   - Allows JPG/JPEG, PNG, WEBP, HEIC, HEIF at picker level.
   - Image conversion happens at upload time through `fileHelpers.ts` + `imageConversion.ts` so packet generation sees PDF-safe images.
   - User can add optional caption per photo.
   - User can drag/reorder photos to tell the repair story.
   - Each photo card is one per line with image on left and metadata/caption/delete on right. On mobile it stacks.
   - Delete photo requires confirmation.

7. Invoice step
   - Upload invoice, repair statement, receipt-backed repair letter, or work order.
   - Limited to PDF, JPG/JPEG, PNG.
   - Includes optional note field.
   - Delete document requires confirmation.
   - Copy should avoid claiming the document “proves” anything. Better language: “supports that the repair was completed.”

8. Supporting documents step
   - Optional.
   - Upload third-party damage statement, responsible party work order, extra receipts, extra proof, or supporting photos.
   - Limited to PDF, JPG/JPEG, PNG.
   - Includes optional note field.
   - Delete document requires confirmation.

9. Signature step
   - Canvas signature capture.
   - Stores signature as Data URL.
   - Important: signature must be stored outside the canvas so it survives component unmounting.

10. Review step
- Shows reminder of required supporting documents.
- Generates completed PDF packet.
- Has loading state with disabled button, spinner, and helper text like “Embedding photos and merging documents...” because packet generation can take a few seconds.

## Browser Navigation Model

The app uses pseudo-pages rather than React Router.

Intent:

- browser back moves to prior step
- in-app back on step 1 returns to pre-start page
- URL hashes restore a step after reload
- no hash should show pre-start page
- terms page is `#terms`, not `/terms`, to avoid GitHub Pages refresh issues

Current desired behavior:

```txt
/                 -> PreStartPage, but saved form data is loaded silently
/#account         -> Account step, restored draft data
/#contact         -> Contact step, restored draft data
/#repair          -> Repair step, restored draft data
/#requirements    -> Requirements step, restored draft/upload state
/#photos          -> Photos step, restored draft/upload state
/#invoice         -> Invoice step, restored draft/upload state
/#documents       -> Supporting documents step, restored draft/upload state
/#signature       -> Signature step, restored draft data
/#review          -> Review step, restored draft/upload state
/#terms           -> Terms page
```

Important rule:

- Do not auto-open the workflow from localStorage when there is no hash.
- Saved draft data should be preserved silently.
- Clicking Start begins at Account step, not the saved current step.
- Valid hash opens that step using saved form data/signature/uploads if available.

This was explicitly corrected after a regression where saved `hasStarted` caused root URL reloads to skip the pre-start page.

## Persistence Model

`draftStorage.ts` owns both form draft persistence and upload draft persistence, but uses different storage mechanisms.

### Form draft storage

Synchronous `localStorage` API:

```ts
loadDraft(maxStepIndex: number): StoredAppState | null
saveDraft(state: StoredAppState): void
clearDraft(): void
```

Persisted form state:

- `hasStarted`
- `currentStepIndex`
- `formData`
- `signatureDataUrl`

`hasStarted` is stored but must not control initial screen when there is no hash. It should be ignored by `getInitialState()` unless a valid workflow hash exists.

### Upload draft storage

Asynchronous IndexedDB API, implemented in same `draftStorage.ts` to preserve one mental model:

```ts
loadDraftUploads(): Promise<StoredUploadState>
saveDraftUploads(uploadState: StoredUploadState): Promise<void>
clearDraftUploads(): Promise<void>
```

Persisted upload state:

- `photos: PacketPhoto[]`
- `invoiceFiles: PacketFile[]`
- `supportingFiles: PacketFile[]`

Important bug and fix:

- Initial implementation saved empty upload arrays immediately on first render before async IndexedDB restore completed.
- This wiped saved uploads on reload.
- Fixed by adding `uploadsRestored` guard in `App.tsx`.
- Upload save effect must do nothing until `uploadsRestored === true`.

Current upload restore pattern:

```txt
mount -> loadDraftUploads() async -> setPhotos/setInvoiceFiles/setSupportingFiles -> setUploadsRestored(true)
```

Current upload save pattern:

```txt
if uploadsRestored is false, do not save
if uploadsRestored is true, save uploads whenever upload arrays change
```

## Image Conversion Model

Image conversion happens at upload time, not during PDF generation.

Reason:

- previews, IndexedDB restore, and PDF generation should all see the same safe format
- `pdf-lib` embeds JPG/PNG directly but does not embed HEIC/HEIF/WEBP directly
- converting late makes PDF generation more fragile

Current files:

```txt
src/lib/imageConversion.ts
src/lib/fileHelpers.ts
```

Expected behavior:

- JPG/JPEG and PNG pass through.
- WEBP converts through browser canvas to PNG.
- HEIC/HEIF converts through `heic2any` to PNG.
- `createPacketFile(file)` converts image files to PDF-safe images before storing them as Data URLs.
- If TypeScript complains about `heic2any`, add `src/types/heic2any.d.ts`:

```ts
declare module 'heic2any'
```

Known caveat:

- existing HEIC/WEBP images already saved in IndexedDB before conversion was added will not be converted until re-uploaded.

## PDF Generation Model

`generateLeakAdjustmentPdf.ts` is responsible for:

- loading official PDF from public asset
- embedding standard Helvetica fonts
- drawing text overlays
- drawing checkbox X marks
- drawing signature images
- appending packet summary page
- appending photo pages with captions
- merging uploaded PDF invoice/supporting docs
- appending uploaded JPG/PNG invoice/supporting images as PDF pages
- downloading final PDF blob

The official PDF appears not to be reliable as a fillable AcroForm, so the app overlays text and signatures by coordinate.

Important architecture:

- `TEXT_POSITIONS`
- `CHECK_POSITIONS`
- `SIGNATURE_POSITIONS`

These coordinate maps are the source of truth.

Do not scatter official PDF coordinates inline again.

Debug tool:

- `DEBUG_COORDINATES = true` renders red crosshair markers at anchor points.

Packet-specific generated pages use normal layout math and helper functions, not official PDF coordinate maps.

Current generated packet order:

```txt
1. Official completed Miami-Dade PDF pages
2. Submission Packet Summary
3. Repair Photo pages
4. Merged invoice/statement PDFs
5. Invoice / Statement image pages
6. Merged supporting document PDFs
7. Supporting Document image pages
```

Current section title preference:

```ts
await addImageDocumentPages(invoiceFiles, 'Invoice / Statement')
await addImageDocumentPages(supportingFiles, 'Supporting Document')
```

Avoid `Supporting Data`; it sounds technical and less homeowner-friendly.

Footer on generated packet pages:

- Add footer only to app-generated packet pages, not the official Miami-Dade PDF pages.
- Preferred name: `Underground Leak Packet Helper`.
- Preferred URL: `https://miamileakadjustment.com/`.
- Footer copy: `Generated by Underground Leak Packet Helper • Not affiliated with Miami-Dade County` plus URL.
- Footer should appear on summary/photo/image pages generated by the app.

Do not stamp or alter official form pages beyond required field/signature overlays.

---

# 3. CURRENT DATA MODEL

## LeakFormData

Purpose: canonical form-entry state for the official Miami-Dade request form fields.

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

## PacketFile and PacketPhoto

Purpose: client-side representation of uploaded documents/photos used for packet generation and IndexedDB persistence.

```ts
type PacketFile = {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
  description: string
}

type PacketPhoto = PacketFile & {
  caption: string
}
```

Important notes:

- Files are stored as Data URLs after conversion/read.
- Photos have `caption`; generic documents have `description`.
- Data URLs are convenient but larger than raw files. IndexedDB is used because `localStorage` is too small for photos/PDFs.
- Future cleanup may store raw `Blob`s in IndexedDB instead of base64 Data URLs.

## WorkflowStep

The `steps` array is the source of truth for:

- progress display
- validation loop
- current step IDs
- hash step restoration
- workflow header title/description

Current structure:

```ts
type StepId =
  | 'account'
  | 'contact'
  | 'repair'
  | 'requirements'
  | 'photos'
  | 'invoice'
  | 'documents'
  | 'signature'
  | 'review'

type WorkflowStep = {
  id: StepId
  label: string
  title: string
  description: string
}
```

`label` is short for side progress rail. `title` and `description` are longer and rendered by `WorkflowHeader`.

Current step titles/descriptions live in `src/data/leakFormData.ts`, not inside `WorkflowHeader`.

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

Current update logic lives in `App.tsx`:

- `updateField()`
- `syncMailingAddress()`

This may later move to a reducer or form state helper if the app grows.

## Signature Data

Signature is stored as:

- PNG data URL string

Important historical bug:

- signature canvas unmounted when the user moved to Review
- `canvasRef.current` became null
- PDF generation threw `Signature is required`

Fixed by:

- storing `signatureDataUrl` in React state
- persisting it in localStorage draft state
- passing it to PDF generation
- redrawing it into `SignatureStep` when returning to signature page

Do not regress to relying on canvas refs from `App.tsx`.

---

# 4. CURRENT IMPLEMENTATION STATE

## Working / Real

### Pre-start page

Real and functional. Should remain simple.

Current content direction:

- one strong hero
- two actions: start form, view official PDF
- four icon overview cards
- clear non-government notice

Do not overload this page.

### Terms page

Real and part of architecture.

- Implemented as pseudo-route `#terms`, not real `/terms`.
- Purpose: non-government status, liability clarity, user responsibility.
- Plain English, not legalese.

### Workflow steps

Real and functional:

- Account
- Contact
- Repair
- Requirements
- Photos
- Invoice
- Supporting Docs
- Signature
- Review

### Client-side PDF packet generation

Real and functional.

Current final output:

- official completed adjustment request form
- generated submission packet summary
- repair photo pages with captions
- invoice/statement PDFs merged
- invoice/statement images embedded
- supporting PDFs merged
- supporting images embedded

### Signature capture

Real and functional.

### Coordinate maps

Real and mostly correct.

Latest note from user:

- positioning now looks good
- page 2 signature x positions adjusted to `x: 150` for both customer and lifetime signatures

### Draft persistence

Implemented:

- form draft/signature: localStorage
- uploads: IndexedDB
- guarded by `uploadsRestored` to prevent empty overwrite on reload

### Image conversion

Implemented or being integrated:

- HEIC/HEIF via `heic2any`
- WEBP via canvas -> PNG
- PDF-safe images stored after conversion

### GitHub setup

Repo exists:

```txt
git@github.com:crdunwel/underground-leak-adjustment-request.git
```

MIT license contents generated using:

```txt
Copyright (c) 2026 Clayton Dunwell
```

## Partial / Needs Care

### PDF packet memory/performance

Packet generation can take a few seconds. Review button now has loading state. Still may be slow or memory-heavy on mobile with many large photos/PDFs.

Future optimization:

- downscale/compress images at upload time
- consider max image dimensions
- consider file size warnings

### Mobile behavior

Basic responsive styles exist. Important improvements already made:

- Back/Continue buttons stay side by side on mobile.
- Photo cards stack on mobile.
- Upload boxes use large finger icon + explicit click/tap wording.

Still needs real iPhone/Safari testing.

### Accessibility

Not deeply audited:

- buttons mostly fine
- native checkbox remains visible for accessibility
- canvas signature may need accessibility fallback later
- details/summary help is simple and accessible-ish
- error messaging likely needs ARIA improvements later

### Privacy/storage UX

Persistence is useful but user should understand:

- data stays in this browser
- uploaded files are saved locally until reset
- app does not submit anything to Miami-Dade

Footer already says “Your data stays in this browser”. Consider adding stronger upload-specific reassurance/warning if needed.

## Placeholder / Deferred

### Plumber referral

A side card exists:

- “Looking for a plumber in Miami?”
- button currently alerts: `Plumber matching coming soon.`

Allowed:

- optional contextual card
- user-invoked
- clearly separate from form guidance

Not allowed:

- interruptive ads
- routing users toward monetized referrals
- making contractor help feel required

### Submission

The app does not submit to Miami-Dade.

It only generates a completed PDF packet. User must submit it through the agency’s process.

### Backend/accounts

Not implemented and intentionally deferred.

---

# 5. LOCKED DESIGN DECISIONS

## Narrow workflow first

Do not generalize prematurely.

This is not yet “all Miami-Dade forms.”

It is a single workflow proving the pattern:

```txt
one frustrating government workflow made simple
```

## Guided questions over open text

The broader product philosophy is:

- normal users get stressed converting bureaucracy into prompts/questions
- guided constrained choices reduce cognitive load
- recognition is easier than generation

The app should avoid relying on open-ended problem descriptions for the core flow.

## Trust first

The tool must repeatedly preserve trust:

- We are not Miami-Dade.
- We cannot approve adjustments.
- We only help fill out and organize the official form/packet.
- User submits to the agency.
- Approval is not guaranteed.
- Data stays in the browser.

Do not blur this.

## No backend yet

Adding backend infrastructure too early is a drift risk.

## Storage split is locked for MVP

- localStorage is enough for lightweight draft fields and signature.
- IndexedDB is required for uploaded files.
- Do not store multiple full-size photos in localStorage.

## Requirements step philosophy

The requirements step should be a calming preview, not a scary legal checklist.

The user is likely confused and anxious. The goal is to say:

```txt
Next you will add photos, add the repair document, optionally add extra proof, sign, and then we generate one PDF packet.
```

Do not dump every official requirement into this step.

Detailed official requirements belong:

- lightly previewed in RequirementsStep
- reinforced contextually in Photos/Invoice/Supporting Docs
- summarized again in Review

## PreStartPage must stay simple

Previous version had too much information and felt inconsistent.

Current preferred direction:

- clean modern card
- icons
- short one-sentence cards
- minimal copy
- clear CTA

## Coordinate maps are locked

Use coordinate maps for official PDF positions.

Do not reintroduce inline coordinate sprawl.

## CSS split is locked

Do not collapse back to `app.css`.

Reason:

- selector collisions already caused visual bugs
- `.preStartCopy > p` accidentally overrode `.departmentPill`
- `.subSection p` caused Step 2 style leakage

Use semantic class names:

- `.preStartIntro`
- `.browserNote`
- `.heroIntro`
- `.subSectionHeader`
- `.requirementsGrid`
- `.simpleNotice`
- `.photoStoryCard`

Avoid broad selectors like:

- `.hero p:last-child`
- `.subSection p`
- `.preStartCopy > p`

## Upload affordance clarity beats elegance

Large finger icon (`👆`) and explicit “Click here to upload...” wording is intentional.

Target user may not understand subtle upload dropzones. This is a government-form helper, not a sleek SaaS dashboard.

---

# 6. REJECTED PATHS

## Monolithic CSS

Rejected.

Why:

- hard to reason about
- broad selectors caused bugs
- future steps compound complexity

## React Router

Rejected for now.

Why:

- app is simple
- GitHub Pages static deployment
- hash routing is sufficient
- avoids static refresh 404 issues

Only revisit if:

- multiple independent forms/workflows are added
- URLs need direct routing beyond simple hash step restoration

## Auto-resume workflow on `/`

Rejected.

Bad behavior:

- user reloads `/` and gets dumped into step 4 unexpectedly

Correct behavior:

- no hash shows PreStartPage
- saved form/upload data still loads silently
- user clicks Start to continue from Account step

## Over-explaining requirements

Rejected.

The user repeatedly preferred:

- one sentence
- direct language
- icons
- less information at once
- calming preview before details

Requirements copy should be accurate, but not intimidating.

## Aggressive contractor marketplace

Rejected as initial framing.

Allowed:

- optional contextual card
- user-invoked
- “coming soon” placeholder

Not allowed:

- interruptive ads
- routing users toward monetized referrals
- making contractor help feel required

## Word/DOC/TXT uploads

Rejected for invoice/supporting documents in current packet generator.

Reason:

- `pdf-lib` cannot merge Word/TXT directly
- if users cannot export/scan as PDF or image, the app should not pretend to support it
- invoice/supporting docs should be limited to PDF, JPG/JPEG, PNG

Photos can accept HEIC/HEIF/WEBP only because conversion is implemented at upload time.

## Stamping official PDF pages with app footer

Rejected.

Footer should be added only to app-generated packet pages, not official Miami-Dade PDF pages.

Reason:

- official form should remain visually official except required field overlays/signatures
- footer on generated pages reinforces trust boundary without altering the official form more than necessary

---

# 7. KNOWN IMPERFECTIONS

## Sample data still used

The app currently uses `sampleLeakFormData` for easier debugging.

Before public launch:

- replace fallback/defaults with `initialLeakFormData`
- remove hidden/debug sample behavior
- verify no sample PII appears in production

The user currently has been okay with sample data during development.

## Storage privacy

Signature is stored in localStorage.

Uploaded files are stored in IndexedDB.

This is convenient but sensitive.

Future:

- add clearer “Clear saved draft” option
- explain uploads are saved locally until reset
- consider a privacy note near upload steps

## IndexedDB edge cases

Known possible issues:

- Safari private mode can behave oddly
- browser may clear storage under pressure
- large Data URLs increase storage use
- async restore means upload state appears slightly after first render

Accepted for MVP.

## PDF position fragility

Manual coordinate overlay depends on:

- exact PDF asset
- page size
- font size
- PDF viewer rendering

If the official PDF changes, positions must be revalidated.

## Packet generation performance

Large photos and PDFs can be slow or memory-heavy.

Future likely need:

- upload-time image downscaling
- max file count or size warnings
- progress messages beyond simple spinner if packet generation grows

## HEIC conversion weight

`heic2any` can increase bundle size and HEIC conversion can be slow.

Accepted because iPhone photos are common and this target user will likely upload phone photos.

## Browser history edge cases

Current approach is lightweight.

Known possible issues:

- repeated pushState entries if user navigates many steps
- manual hash edits
- back behavior around intro/workflow/terms boundary
- reload and history state mismatch

Accepted for MVP.

## Plumber card placeholder

Do not pretend matching exists.

Should remain:

- disabled
- alert placeholder
- “Coming soon”

until real.

---

# 8. NEXT BUILD TARGET

## Immediate next objective

Finish production polish around copy, storage clarity, and PDF packet trust markers.

Expected behavior:

- `/` loads PreStartPage.
- All hash steps load correctly.
- Saved form fields restore in all cases.
- Saved signature restores if available.
- Saved uploads restore from IndexedDB without being wiped by initial empty state.
- Start button begins at Account step.
- Back button on Account returns to PreStartPage.
- Browser back follows prior step history.
- Reset clears localStorage draft, IndexedDB uploads, signature, and returns to Account step after confirmation.
- Review step shows visible loading state during packet generation.
- Generated packet includes only supported/converted files.
- Generated packet summary and app-generated pages include footer naming `Underground Leak Packet Helper` and URL.
- Official Miami-Dade pages are not stamped with app footer.

## Then

1. Test production build on GitHub Pages.
2. Confirm `vite.config` base is `/underground-leak-adjustment-request/`.
3. Confirm `assetPath()` works for official PDF.
4. Test with:
   - blank form
   - sample form
   - JPG photos
   - PNG photos
   - HEIC iPhone photos
   - WEBP image
   - PDF invoice
   - PNG/JPG invoice
   - supporting PDF
   - supporting image
5. Test reload after uploads, especially on `/#photos`, `/#invoice`, and `/#review`.
6. Verify final PDF packet order and footer placement.
7. Replace sample defaults before launch.
8. Consider image downscaling/compression if packet generation is slow.

## What done looks like

A stressed Miami-Dade homeowner can:

1. Open the app.
2. Understand it is not the government.
3. Fill out the official form fields.
4. Understand what documents/photos they need.
5. Upload photos/invoices/supporting docs without losing work on reload.
6. Sign once.
7. Download one completed packet.
8. Know they still must submit it to Miami-Dade.

---

# 9. CRITICAL IMPLEMENTATION NOTES

## App.tsx responsibilities

`App.tsx` currently owns:

- high-level workflow state
- route state
- history integration
- localStorage draft persistence effect
- IndexedDB upload restore/save effects
- field update routing
- mailing address sync
- step rendering
- PDF generation call

This is acceptable for now but close to becoming too large.

If it grows again, extract:

- `useWorkflowHistory`
- `useLeakDraft`
- `useLeakUploads`
- `useLeakFormState`

Do not prematurely abstract unless `App.tsx` becomes painful again.

## draftStorage.ts rules

`draftStorage.ts` should not decide navigation behavior.

It should only:

- load draft data
- save draft data
- clear draft data
- load draft uploads
- save draft uploads
- clear draft uploads

`App.tsx` decides:

- whether hash means open workflow
- whether root shows intro
- when upload saving begins after restore

## getInitialState() correct logic

Correct logic:

```txt
savedDraft = loadDraft()
hashStep = current hash

if hashStep is valid workflow step:
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

Do not restore `hasStarted` from localStorage when no hash exists.

## Upload restore/save race condition

Do not remove `uploadsRestored` guard.

Bad pattern:

```txt
initial render photos=[] -> saveDraftUploads(empty) -> wipes IndexedDB -> then restore loads empty
```

Correct pattern:

```txt
initial render photos=[] -> do not save because uploadsRestored=false
loadDraftUploads() -> set upload arrays -> setUploadsRestored(true)
subsequent upload changes -> save
```

## appRouter responsibilities

`appRouter.ts` should only:

- parse hash
- push route
- replace route

It should not know about:

- form state
- persistence
- validation
- workflow business logic

## History state

History state shape:

```ts
type AppHistoryState = {
  screen: 'intro' | 'terms' | 'workflow'
  stepId?: StepId
}
```

## Validation rules

`validation.ts` must handle all current `StepId`s:

- `account`
- `contact`
- `repair`
- `requirements`
- `photos`
- `invoice`
- `documents`
- `signature`
- `review`

Requirements/documents may be non-blocking. Photos/invoice behavior has been discussed both ways. Current UI can show errors, but avoid trapping users unless the product intentionally requires attachments before generation.

## Plumber license placeholder

Florida plumbing contractor license examples:

- `CFC1234567` for Certified Plumbing Contractor
- `RF1234567` for Registered Plumbing Contractor

Current preferred placeholder:

```tsx
placeholder="For Example: CFC1234567"
```

Could be softened to:

```tsx
placeholder="Example: CFC1234567"
```

## Official form requirements

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
- before covering, repairs may need Department verification
- hazardous traffic area repairs require photographs before covering
- third-party damage requires work order/statement from responsible party

Keep user-facing copy short, but do not contradict these requirements.

## Copy constraints

Avoid saying:

```txt
This proves your repair was completed.
```

Prefer:

```txt
This supports that the repair was completed.
```

Reason: Miami-Dade decides whether documentation is sufficient.

## Generated packet helper name

Preferred app-generated footer identity:

```txt
Underground Leak Packet Helper
```

Preferred URL:

```txt
https://miamileakadjustment.com/
```

Footer should include:

```txt
Generated by Underground Leak Packet Helper • Not affiliated with Miami-Dade County
```

Only app-generated pages should include the footer.

---

# 10. USER MENTAL MODEL

## User believes

“I have a high water bill because of a leak, and this tool helps me correctly prepare the official Miami-Dade leak adjustment packet.”

## User fears

- submitting wrong info
- missing required documents
- wasting time
- government rejection
- losing progress
- not understanding the process
- accidentally trusting a fake/scam site
- uploading photos/docs and then losing them
- not knowing whether the downloaded packet is complete enough to submit

## User must not believe

- this app is Miami-Dade
- this app submits the form automatically
- approval is guaranteed
- contractor referral is required
- data is being stored on a server
- unsupported file formats will be magically accepted in the final PDF

## Success feeling

The user should feel:

- guided
- calm
- not stupid
- not trapped
- like the PDF packet is ready
- like they know what to submit with it
- like their uploaded photos/docs were not lost
- like the app is legitimate but clearly not the government

## UX anchors

Use:

- icons
- one-sentence cards
- clear CTAs
- visible progress
- short disclaimers
- calm blue/white visual system
- explicit upload affordances
- strong selected states
- plain English requirements previews

Avoid:

- long paragraphs
- legalese
- government-document density
- complex branching too early
- subtle upload/dropzone UI that users may miss
- copy that sounds like approval is promised

---

# 11. CODE GENERATION RULES

## User preference

The user prefers:

- full replacement code when changes are localized
- exact paste-ready snippets
- file path comment at top of code snippets
- no vague instructions when code is needed
- Potential Problems section for generated code
- concise but complete explanations

## Comment system

When adding comments, use:

- `#` for structural sections
- `▶` for high-level flow/story
- `§` sparingly for critical constraints

Only apply when useful.

## Style

- Avoid em dashes.
- Use straight quotes.
- Avoid hype.
- Avoid generic “robust platform” language.
- Keep copy plain and human.
- User has explicitly banned em dashes in writing.

## CSS

- Keep split CSS structure.
- Use semantic classes.
- Avoid broad positional selectors.
- Avoid Tailwind.
- Avoid over-specific hacks unless needed.
- Keep mobile behavior explicit.
- Upload boxes intentionally use large finger icon and explicit copy.

## React

- Keep components focused.
- Avoid introducing context/reducers until needed.
- Do not add React Router unless the project expands beyond simple hash pseudo-pages.
- Avoid hidden magic.

## PDF

- Keep official PDF coordinates centralized.
- Keep debug markers available.
- Avoid fancy auto-detection unless explicitly requested.
- Test output after coordinate changes.
- Add footer only to app-generated packet pages.
- Keep official pages visually official except necessary field/signature overlays.

## File handling

- Invoice/supporting docs should be limited to PDF, JPG/JPEG, PNG.
- Photos may allow HEIC/HEIF/WEBP only if upload-time conversion remains active.
- Do not claim unsupported docs are included.
- Prefer conversion at upload time over PDF-generation time.

---

# CURRENT PRIORITY

## Single most important current build objective

Ship a reliable static MVP that lets a Miami-Dade homeowner generate a completed, signed leak adjustment PDF packet with restored draft data, restored uploads, clear instructions, and no misleading claims.

## Main architectural risk

Letting a narrow static utility app turn into a generalized, backend-heavy, route-heavy, marketplace-style platform too early.

## What not to get distracted by

- generalized form search
- AI matching
- backend accounts
- contractor marketplace
- analytics dashboards
- automatic submission
- broad Miami-Dade form library
- overbuilding document conversion beyond PDF/JPG/PNG plus photo HEIC/WEBP conversion
- legalistic copy that overwhelms scared users

The winning wedge right now is one clean workflow that works.
