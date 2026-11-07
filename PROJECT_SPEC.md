# Aqua Tracker — Project Specification

**Repository:** https://github.com/myspace-a/Acqua  
**Live application:** https://myspace-a.github.io/Acqua/  
**Default branch:** `main`

This document is the **single source of truth** for Aqua Tracker's product requirements, functional behavior, technical constraints, approved decisions and project status.

Detailed visual presentation of the UI is maintained separately in [`docs/ui/UI_DESIGN.md`](docs/ui/UI_DESIGN.md).

If another project document conflicts with this specification, this document is authoritative for application requirements and behavior.

---

## 1. Project Purpose and Scope

Aqua Tracker is a lightweight, mobile-oriented Progressive Web App (PWA) for recording and reviewing:

- Daily water intake
- Daily bathroom visits

The application is designed to work reliably offline and to keep tracking data locally on the user's device.

The project intentionally uses a simple client-side architecture.

### Current scope

The application currently provides:

- Water intake tracking
- Bathroom visit tracking
- Daily timelines and statistics
- Historical day review
- Excel import/export
- Offline operation
- PWA installation
- Italian and English user interfaces

### Out of scope for the current application

There is currently:

- No application backend
- No user account system
- No cloud synchronization
- No multi-device synchronization

A future backend may be considered separately.

---

## 2. Project Principles

The project should prioritize:

1. Simplicity
2. Reliability
3. Preservation of existing user data
4. Offline operation
5. Mobile usability
6. Low technical complexity
7. Clear separation between requirements, design and implementation

Changes should avoid unnecessary refactoring or technology changes.

---

## 3. Project Status

| Area | Status |
|---|---|
| Phase 1 — Application foundation and water tracking | Completed |
| Phase 2 — Bathroom visit tracking | Completed |
| UI redesign requirements | Approved |
| UI redesign mock-ups | Approved |
| UI redesign implementation | Not yet implemented |
| Backend | Future / not defined |

### Phase 1

The original application foundation and water-tracking functionality are complete.

The application was subsequently reorganized into separate HTML, CSS and JavaScript files without intentionally changing its behavior.

### Phase 2 — Bathroom visits

Bathroom visit tracking was implemented, tested by the owner in the browser, including offline operation, and merged into `main` through Pull Request #5 on 1 November 2026.

The completed functionality includes:

- Bathroom visit recording
- Optional visit duration
- Individual visit deletion
- Daily bathroom statistics
- Combined history
- Excel export/import
- Duplicate prevention
- Offline operation

### Current initiative — UI redesign

The UI redesign requirements and reference mock-ups have been completed and approved.

The redesign is **not yet implemented**.

The redesign is a presentation and usability project. It must preserve the existing tracking data and functionality unless a requirement in this specification explicitly changes the user interface behavior.

---

## 4. Application Architecture

Aqua Tracker is a client-only PWA.

### Technology

- HTML
- CSS
- Plain JavaScript
- Browser `localStorage`
- SheetJS for Excel import/export
- Service Worker
- GitHub Pages

No JavaScript framework or build system is required.

### Current application structure

```text
Acqua/
├── index.html
├── style.css
├── README.md
├── PROJECT_SPEC.md
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
├── docs/
│   └── ui/
│       ├── UI_DESIGN.md
│       └── mockups/
├── js/
│   ├── storage.js
│   ├── water.js
│   ├── toilet.js
│   ├── backup.js
│   └── main.js
└── lib/
    └── xlsx.full.min.js
```

### File responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Application HTML structure |
| `style.css` | Application styling |
| `js/storage.js` | Loading and saving application data |
| `js/water.js` | Water entries, deletion, timeline, progress, history and shared utilities |
| `js/toilet.js` | Bathroom visits, deletion, timeline and daily statistics |
| `js/backup.js` | Excel export and import |
| `js/main.js` | Application startup and event listeners |
| `lib/xlsx.full.min.js` | Local SheetJS library |
| `manifest.json` | PWA configuration |
| `sw.js` | Offline caching |

The existing separation of responsibilities should be preserved unless a future approved requirement requires otherwise.

---

# 5. Functional Requirements — Water Tracking

## 5.1 Recording water intake

The application must allow the user to record water intake for a selected date.

Each water registration records:

- Time
- Water volume
- Quantity of glasses
- Optional note, where supported by the existing application

The user normally records one glass at a time.

Individual water registrations can be deleted without deleting other registrations.

---

## 5.2 Water volume selection

The redesigned interface must provide these water-volume options:

- 100 ml
- 150 ml
- 200 ml
- 250 ml
- 300 ml
- 400 ml

500 ml and 350 ml are not part of the redesigned volume-selection set.

The selected volume must remain clearly visible in the interface.

The application must allow the user to select a different volume for each registration.

### Remembered volume

The application must remember the user's last selected water volume locally.

When the user creates a subsequent water registration, the last selected volume should be preselected.

For a new installation with no previously remembered volume, the default selection is **200 ml**.

This preference must work offline and must not modify historical tracking records.

---

## 5.3 Optional glass counter

The application may provide an optional glass counter controlled through Settings.

The setting has two states:

- Enabled
- Disabled

The default state is **disabled**.

When disabled:

- The glass counter is hidden.
- Water volume selection remains available.

When enabled:

- The glass counter is displayed.
- The user can adjust the number of glasses.

Changing this setting must not alter or delete existing tracking data.

The existing stored water data must remain compatible with the application.

---

## 5.4 Daily water view

The application must allow the user to select a date.

For the selected date, the application must provide:

- Water intake timeline
- Individual deletion of entries
- Daily water statistics
- Daily progress toward the existing fixed water goal of 2,000 ml

The existing water calculations must be preserved.

The timeline must display the relevant information for each water registration, including time and volume.

---

## 5.5 Water history

The application must provide historical daily information.

For each applicable day, history should continue to provide the existing water information, including:

- Total water intake
- Number of water entries
- Total number of glasses

Selecting a historical day loads its records.

---

# 6. Functional Requirements — Bathroom Visits

Bathroom visit tracking is completed functionality and must be preserved during the UI redesign.

## 6.1 Recording a bathroom visit

Each visit contains:

- Time — required and prefilled with the current time
- Duration — optional, in seconds

No notes field is required for bathroom visits.

When entered, duration must be a whole number between **1 and 3,600 seconds**.

An empty duration is valid and contributes zero seconds to daily duration totals.

---

## 6.2 Bathroom daily view

The application must provide a bathroom visit timeline for the selected date.

Each visit must display:

- Time
- Duration, when entered
- Individual delete control

Daily bathroom statistics must include:

- Number of visits
- Total duration in seconds

Deleting a visit must remove only the selected visit.

---

## 6.3 Bathroom history

History combines water and bathroom information.

A day should show applicable:

- Water total
- Water entry count
- Water glass count
- Bathroom visit count
- Bathroom total duration

Days containing only bathroom visits must also appear in history.

---

# 7. Excel Import and Export

Excel backup and restore must continue to support both tracking datasets.

## 7.1 Water worksheet

Water worksheet name:

`Idratazione`

Columns:

- Data
- Orario
- Bicchieri
- Dimensione (ml)
- Totale assunzione (ml)
- Nota

Existing water import validation requirements remain applicable.

These include:

- Maximum file size: 2 MB
- Maximum 10,000 imported rows
- Time format: HH:MM
- Valid predefined glass size
- Glass quantity: 1–20
- Note maximum: 60 characters
- Duplicate water entries must not be imported

Water duplicates are identified using:

- Date
- Time
- Size
- Quantity
- Note

### Existing limitation

The current water importer uses `parseInt()` before validation, which can cause values such as `1.5` or `200abc` to be interpreted as valid integers.

This is an existing limitation and is not part of the UI redesign.

It remains a future improvement.

---

## 7.2 Bathroom worksheet

Bathroom worksheet name:

`Bagno`

Columns:

- Data
- Orario
- Durata (secondi)

Import requirements:

- Valid date and time
- Time format: HH:MM
- Duration may be blank
- Entered duration must be a whole number from 1 to 3,600
- Summary/total rows are ignored
- Duplicate visits must not be imported

Bathroom duplicates are identified using:

- Date
- Time
- Duration

---

## 7.3 Compatibility

The application must continue to support:

- Existing water-only Excel backups
- Backups containing both worksheets
- Export when only water data exists
- Export when only bathroom data exists
- Export when both datasets exist

Importing a backup must not destroy existing tracking records.

---

# 8. Data Storage and Preservation

Tracking data is stored locally in browser `localStorage`.

The redesign must not change the existing tracking-data storage keys or formats without an explicit migration requirement.

## 8.1 Water data

Existing key:

`water-tracker-v2-timed`

Existing record structure includes:

```json
{
  "time": "10:30",
  "size": 200,
  "qty": 2,
  "note": "Dopo allenamento"
}
```

The existing water key and stored record structure must remain compatible.

Existing historical data must be preserved.

---

## 8.2 Bathroom data

Existing key:

`toilet-tracker-v1`

Bathroom data is stored separately and grouped by date.

Records contain:

- `time`
- `duration`

A missing duration is represented as `null`.

---

## 8.3 UI preferences

New UI preferences must be stored separately from tracking records.

These preferences include, as applicable:

- Selected layout
- Glass-counter setting
- Selected language
- Last selected water volume

Changing a preference must not modify or delete tracking records.

Preferences must persist after closing and reopening the application.

Preferences must work offline.

---

# 9. UI Behavior Requirements

The UI redesign must preserve the application's functionality while improving clarity and mobile usability.

Detailed visual design is documented separately in [`docs/ui/UI_DESIGN.md`](docs/ui/UI_DESIGN.md).

## 9.1 Layout

The application must support the approved layout model:

- Single vertically scrolling page
- Optional two-tab layout

The two-tab layout contains:

### Input

- Date selector
- Water input
- Bathroom input

### Summary

- Date selector
- Water intake timeline
- Water statistics
- Bathroom visit timeline
- Bathroom statistics
- Collapsible History

The date selector must be available in both views.

Changing the selected date in either view must update the other.

Switching between views must not lose or modify recorded data.

---

## 9.2 Visual distinction

The water and bathroom functions must be visually distinguishable to reduce accidental selection of the wrong function.

Water uses a blue visual identity.

Bathroom uses a green visual identity.

The redesign must apply this distinction consistently across the relevant controls, timelines and statistics.

---

## 9.3 UI terminology

### Italian

| Area | Term |
|---|---|
| Water input | Assunzione Acqua |
| Water timeline | Assunzioni Acqua |
| Water statistics | Totale assunzioni acqua |
| Bathroom input | Bagno |
| Bathroom timeline | Visite in bagno |
| Bathroom statistics | Riepilogo visite |
| Input tab | Inserimento |
| Summary tab | Riepilogo |

### English

| Area | Term |
|---|---|
| Water input | Water |
| Water timeline | Water Intake |
| Water statistics | Total Water Intake |
| Bathroom input | Bathroom |
| Bathroom timeline | Bathroom Visits |
| Bathroom statistics | Visit Summary |
| Input tab | Input |
| Summary tab | Summary |

The English terminology above is the approved terminology for the redesign.

---

# 10. Language Requirements

The application must support:

- Italian
- English

## 10.1 Default language

Italian is the default language.

## 10.2 Language selection

The user must be able to change language through the hamburger menu.

## 10.3 Persistence

The selected language must:

- Be saved locally
- Persist after reopening the application
- Work offline

## 10.4 Translation coverage

All user-visible application text must support the selected language, including:

- Menu items
- Section titles
- Labels
- Buttons
- Placeholders
- Timeline labels
- Statistics
- Settings
- Confirmations
- Import/export messages
- Other application messages

Changing language must not alter tracking data.

No external translation service may be required for normal operation.

---

# 11. Settings and Navigation

The hamburger menu is the primary application menu.

The redesigned application should not retain a redundant separate three-dot settings menu.

The main menu must provide access to:

### Italian

- Backup Excel
- Impostazioni
- Lingua
- Informazioni

### English

- Excel Backup
- Settings
- Language
- Information

Settings must provide the approved presentation preferences, including:

- Layout selection
- Glass-counter setting

Language selection is available through the Language menu item.

---

# 12. PWA and Offline Requirements

The application must continue to operate as an offline-capable PWA.

The existing Service Worker architecture must be preserved.

Current cache name:

`tracker-acqua-v3`

The cache must contain all assets required for normal application operation, including:

- Application HTML
- CSS
- JavaScript
- SheetJS library
- Manifest
- Icons

The Excel library must remain locally available so that Excel import/export continues to work offline.

After a release:

1. Increment the Service Worker cache version when required.
2. Verify all required assets are cached.
3. Test online operation.
4. Test offline operation.

The UI redesign must not remove PWA installation capability.

---

# 13. Security and Privacy

- No application backend currently exists.
- Tracking data must remain local.
- Tracking data must not be transmitted to external services.
- User-provided text must be sanitized before being rendered.
- Imported data must be validated before being saved.
- Existing privacy behavior must be preserved.

Users are responsible for maintaining backups before clearing browser data or changing device/browser.

---

# 14. Development and Implementation Constraints

The UI redesign should remain within the existing technical architecture.

### Required

- Plain HTML
- CSS
- JavaScript
- Existing localStorage approach
- Existing PWA/service-worker approach
- Existing Excel library

### Avoid

- Framework migration
- Backend implementation
- Account system
- Cloud synchronization
- Database server
- Unnecessary build tooling
- Unnecessary refactoring

The redesign is a UI/usability initiative, not a backend initiative.

Implementation must preserve existing data and functionality.

---

# 15. Testing Expectations

Testing is primarily user-oriented and should be executable by the project owner through the browser without requiring an automated test framework.

## 15.1 Existing regression testing

Water and bathroom functionality must continue to work after the redesign.

At minimum, test:

- Add water entry
- Delete water entry
- Change date
- Review history
- Add bathroom visit
- Add visit without duration
- Delete bathroom visit
- Check bathroom statistics
- Check history
- Export Excel
- Import Excel
- Duplicate prevention
- Existing water-only backup compatibility
- Close and reopen application
- Offline operation

## 15.2 UI redesign testing

The redesign must additionally be checked for:

- Correct Italian default language
- Switching between Italian and English
- Language persistence
- Correct translated interface text
- Correct water terminology
- Correct bathroom terminology
- Correct blue/green visual distinction
- Correct water-volume options
- Default 200 ml selection on a new installation
- Remembering the last selected water volume
- Glass counter hidden by default
- Glass counter behavior when enabled
- Layout preference persistence
- Date synchronization between tabs
- Switching between Input and Summary without data loss
- Correct timeline layout
- No overlap between timeline information and delete controls
- Usability on a mobile screen

## 15.3 Data preservation

Before acceptance, confirm that existing water and bathroom records remain intact after the redesign.

No destructive migration is acceptable without an explicitly approved migration plan.

---

# 16. Development Workflow

Development is incremental and organized into separate Build Chats.

### Branch and Pull Request workflow

1. Start from the latest `main`.
2. Create a feature branch for the development task.
3. Inspect the existing files before coding.
4. Confirm the implementation scope.
5. Implement only the approved scope.
6. Review the changes.
7. Test the application.
8. Create a Pull Request into `main`.
9. Merge only after successful testing and owner approval.

Development should not be performed directly on `main`.

Requirements and product decisions are defined separately from implementation.

---

# 17. Roadmap and Backlog

## Completed

### Phase 1 — Application foundation and water tracking

Completed.

### Phase 2 — Bathroom visits

Completed, tested and merged into `main`.

---

## Current

### UI Redesign

Requirements and approved visual references are complete.

Implementation is the next development activity.

The implementation must use:

- This specification for requirements and behavior
- [`docs/ui/UI_DESIGN.md`](docs/ui/UI_DESIGN.md) for visual design
- The approved mock-ups under `docs/ui/mockups/` as visual references

The UI redesign must not introduce backend functionality.

---

## Future

### Backend investigation

Backend work remains a future backlog item.

Before implementation, requirements must be defined for questions including:

- Purpose of synchronization
- Multi-device behavior
- Authentication
- Hosting
- Privacy
- Offline synchronization
- Migration of existing local data
- Backup strategy
- Whether a backend is actually necessary

No backend implementation is currently approved.

---

# 18. Documentation Ownership

The project uses three complementary documentation layers.

| Document | Responsibility |
|---|---|
| `README.md` | Concise project overview and entry point |
| `PROJECT_SPEC.md` | Authoritative requirements, behavior, technical constraints and decisions |
| `docs/ui/UI_DESIGN.md` | Visual and interaction design reference |
| `docs/ui/mockups/` | Approved visual mock-ups referenced by the UI design document |

The distinction is:

> **What the application must do → `PROJECT_SPEC.md`**

> **How the approved UI presents or organizes it → `UI_DESIGN.md`**

> **What the project is and where to find information → `README.md`**

---

# 19. Change Log

- **2026-10-18:** Initial project reference created.
- **2026-10-18:** Step 1 application file separation completed.
- **2026-10-18:** Shared utility struct
- **2026-11-01:** Step 2 — Bathroom visits completed, browser-tested including offline operation, and merged into main through PR #5.
- **2026-11-03:** Documentation reorganization initiated; README established as the repository introduction.
- **2026-11-03:** UI redesign requirements and approved design decisions completed.
- **2026-11-05:** Proposed documentation structure established with separate project specification and UI design reference. UI redesign implementation remains pending.
