Aqua Tracker — Project Specification

Repository: https://github.com/myspace-a/Acqua
Live application: https://myspace-a.github.io/Acqua/
Default branch: "main"

This document is the single source of truth for Aqua Tracker's functional requirements, architecture, technical decisions, development rules and project status.

Update the Change log whenever a development step is completed.

---

1. Project overview

Aqua Tracker is a client-only Progressive Web App (PWA) for tracking:

- Daily water intake.
- Daily toilet visits.

The application is designed primarily for mobile use.

General principles

- UI language: Italian. All application interface text must remain in Italian.
- Client-only application: no application backend currently exists.
- Data persistence: browser localStorage.
- Hosting: GitHub Pages.
- Offline operation: Service Worker.
- Technology: plain HTML, CSS and JavaScript.
- No frameworks or build tools.

Tracking data remains on the device and browser where it was entered. Users should export backups regularly.

---

2. Current project status

Development step| Status
Step 1 — Separate HTML, CSS and JavaScript files| Completed
Step 2 — Toilet visit tracking (Bagno)| Completed, tested and merged into "main"
Future backend| Not defined

Step 2 was implemented on a feature branch, tested by the owner in a browser (including offline operation), and merged through GitHub Pull Request #5 on 1 November 2026.

---

3. Current application structure

Acqua/
├── index.html
├── style.css
├── README.md
├── PROJECT_SPEC.md
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
├── js/
│   ├── storage.js
│   ├── water.js
│   ├── toilet.js
│   ├── backup.js
│   └── main.js
└── lib/
    └── xlsx.full.min.js

File responsibilities

File| Responsibility
"index.html"| Application HTML structure
"style.css"| Application styling
"js/storage.js"| Loading and saving data; the only file that accesses localStorage
"js/water.js"| Water entries, deletion, timeline, progress, history and shared utilities
"js/toilet.js"| Toilet visits, deletion, timeline and daily statistics
"js/backup.js"| Excel export and import
"js/main.js"| Application startup and event listeners
"lib/xlsx.full.min.js"| Local SheetJS 0.18.5 library
"manifest.json"| PWA configuration
"sw.js"| Offline caching

Shared utilities

The following shared helpers are defined in "js/water.js":

- "sanitize()"
- "showToast()"
- "getTodayKey()"
- "getNowTime()"
- "formatDate()"

"js/toilet.js" reuses these helpers.

There is no "js/utils.js" file.

---

4. Functional requirements — Water tracking

4.1 Core tracking

Users can record daily water intake.

Each entry contains:

- Time.
- Glass size in millilitres.
- Number of glasses.
- Optional note (maximum 60 characters).

Multiple entries can be recorded on the same day at different times.

Users can delete individual entries.

4.2 Glass sizes and quantity

Available glass sizes:

100, 150, 200, 250, 300, 350, 400 and 500 ml.

Default size: 200 ml.

Number of glasses per entry: 1–20, controlled using plus/minus buttons.

Each entry has one glass size and a quantity. There is no separate counter for each glass size.

4.3 Daily view

- Date picker to select a day.
- Timeline sorted by time.
- Individual delete button for each entry.
- Daily progress towards a fixed goal of 2,000 ml.
- Progress bar with red, yellow and green states.
- Statistics:
  - Number of entries.
  - Total glasses.
  - First intake time.
  - Last intake time.

4.4 History

A collapsible history displays past days.

Each day shows:

- Total water intake in ml.
- Number of water entries.
- Total number of glasses.

Selecting a day loads its records.

4.5 Water Excel backup

Water worksheet name: "Idratazione".

Columns:

- Data
- Orario
- Bicchieri
- Dimensione (ml)
- Totale assunzione (ml)
- Nota

Import validation requirements:

- Maximum file size: 2 MB.
- Maximum 10,000 imported rows.
- Time format: HH:MM.
- Glass size must be one of the predefined sizes.
- Number of glasses: 1–20.
- Note: maximum 60 characters.
- Duplicate water entries must not be imported.

Water duplicate identification uses date, time, size, quantity and note.

Known existing limitation: The current water importer uses "parseInt()" before validation. Consequently, values such as "1.5" or "200abc" may be accepted as "1" or "200". This weakness existed on "main" before Step 2 and was not introduced by the toilet feature. It remains a separate improvement to address in a future task.

---

5. Functional requirements — Toilet visits (Bagno)

Status: implemented, tested and merged into "main".

5.1 Entry fields

The application provides a separate card labelled Bagno.

Each visit contains:

- Time: required, prefilled with the current time.
- Duration: optional, expressed in seconds.
- No notes field.

When entered, duration must be a whole number between 1 and 3,600 seconds.

An empty duration is valid and contributes zero seconds to daily totals.

5.2 Daily view

The application displays a separate toilet visit timeline.

Each visit shows:

- Time.
- Duration, if entered.
- Individual delete button.

Daily statistics:

- Number of visits.
- Total duration in seconds.

Deleting a visit removes only the selected visit.

5.3 History

The history combines water and toilet information.

Each day shows:

- Water total in ml.
- Number of water entries and glasses.
- Number of toilet visits.
- Total toilet duration in seconds.

Days containing only toilet visits must also appear in history.

5.4 Toilet data structure

Toilet data is stored separately from water data, grouped by date.

Example:

{
  "2026-11-01": [
    {
      "time": "10:30",
      "duration": 45
    },
    {
      "time": "14:15",
      "duration": null
    }
  ]
}

A missing duration is stored as "null".

5.5 Toilet Excel backup

The toilet worksheet is named "Bagno".

Columns:

- Data
- Orario
- Durata (secondi)

Import rules:

- Date and time must be valid.
- Time format: HH:MM.
- Duration may be blank or a whole number from 1 to 3,600.
- Summary/total rows are skipped.
- Duplicate visits are not imported.

Toilet duplicate identification uses date, time and duration.

5.6 Compatibility

- Existing water data must remain untouched.
- Old water-only Excel backups must continue to import successfully.
- A missing "Bagno" worksheet is valid.
- Export must work when only water data exists, only toilet data exists, or both exist.

---

6. Data storage

The application uses browser localStorage.

Only "js/storage.js" is allowed to access localStorage.

Water data

Key:

"water-tracker-v2-timed"

Existing data structure:

{
  "2026-11-01": [
    {
      "time": "10:30",
      "size": 200,
      "qty": 2,
      "note": "Dopo allenamento"
    }
  ]
}

The water key and record format must not change without an explicit migration plan.

Existing user history must be preserved.

Toilet data

Key:

"toilet-tracker-v1"

Data is stored separately from water data, grouped by date.

Record fields:

- "time"
- "duration"

Do not combine the two datasets or change the existing water storage format.

---

7. Technical rules

Application architecture

- Use plain HTML, CSS and JavaScript.
- No frameworks or build tools.
- Keep the existing separation of responsibilities between JavaScript files.
- Avoid unnecessary refactoring.
- No inline event handlers in HTML; use event listeners.
- Sanitize user-provided text before displaying it.
- Validate imported data.
- Keep the application UI in Italian.

PWA and offline support

Current Service Worker cache name:

"tracker-acqua-v3"

The cache uses a cache-first strategy.

The cache list must include all required application assets:

- "./"
- "index.html"
- "style.css"
- All JavaScript files in "js/"
- "lib/xlsx.full.min.js"
- "manifest.json"
- "icon-192.png"
- "icon-512.png"

On every release:

1. Increment the cache version.
2. Check that all required assets are included.
3. Verify that the application works online and offline.

The Excel library must remain locally available so that import and export work offline.

---

8. Security and privacy

- No application backend currently exists.
- Tracking data is stored locally in browser localStorage.
- No tracking data should be transmitted to external services.
- User-provided text must be sanitized before being rendered.
- Imported data must be validated before being saved.
- Avoid inline event handlers.

Users are responsible for exporting backups before clearing browser data, changing browsers or changing devices.

---

9. Development workflow

Development is incremental and organized into separate build tasks/chats.

Branch and Pull Request workflow

1. Start from the latest "main".
2. Create a feature branch for each development task.
3. Inspect existing files before coding.
4. Agree on the files to be changed before implementation.
5. Implement only the approved scope.
6. Review the changes.
7. Test the application before merging.
8. Create a Pull Request into "main".
9. Merge only after successful testing and owner approval.

Do not develop directly on "main".

Delivery rules

- Prefer complete files over partial patches when delivering files for manual upload.
- Provide simple instructions suitable for a non-developer.
- Avoid requiring terminal commands or automated testing frameworks for normal application acceptance testing.
- The requirements and coaching work is separate from implementation work.

Release backup

Before every release, export an Excel backup from the application.

---

10. Testing strategy

Testing is primarily user-oriented and performed through the browser.

The owner should be able to execute the acceptance tests without using automated test frameworks or complicated developer tools.

Water regression tests

- Add a water entry.
- Delete a water entry.
- Change the selected date.
- Open history.
- Export Excel.
- Import Excel.
- Confirm existing water data is preserved.
- Close and reopen the application.

Toilet tests

- Add a visit with a duration.
- Add a visit without a duration.
- Confirm the time is prefilled.
- Delete one visit and verify that other visits remain.
- Change the selected date.
- Check visit count and total duration.
- Check history, including a day with only toilet visits.

Backup tests

- Export when both datasets exist.
- Export when only toilet data exists.
- Import a backup containing both worksheets.
- Import an older water-only backup.
- Import the same backup twice and verify that duplicates are not created.

Offline tests

- Load the application online first.
- Open the application offline.
- Add and delete water and toilet entries.
- Export and import Excel backups while offline.
- Close and reopen the application.

Recorded test status

Step 2 was successfully tested by the owner in a browser, including:

- Water regression checks.
- Toilet entry and deletion.
- Daily statistics and history.
- Excel export and import.
- Old water-only backup compatibility.
- Duplicate import checks.
- Offline operation, including backup export and import.

No automated test suite was run as part of Step 2.

---

11. Roadmap

Completed

1. Step 1 — Application file separation
   
   - Separated HTML, CSS and JavaScript.
   - No intended change in appearance or functionality.
   - Completed and confirmed working on 18 October 2026.

2. Step 2 — Toilet visits (Bagno)
   
   - Separate toilet tracking.
   - Daily statistics and combined history.
   - Excel backup and import.
   - Offline support.
   - Tested and merged into "main" through PR #5 on 1 November 2026.

Future — Backend

Backend development is not yet defined or approved.

Questions to resolve before starting:

- What is the purpose? Multi-device synchronization, safer backup, sharing or something else?
- Where should it be hosted?
- How should users authenticate?
- What are the privacy implications?
- How should offline operation work?
- How will existing localStorage data be migrated?
- Is a backend actually necessary?

Do not start backend implementation until its requirements and architecture have been agreed.

---

12. Decisions and constraints

- Water counter: one glass size plus a quantity per entry.
- Daily water goal: fixed at 2,000 ml.
- Deleting an entry removes only the selected entry. Identical entries must remain.
- Existing water localStorage key and data format must be preserved.
- UI language remains Italian.
- Toilet data is stored separately.
- Toilet duration is optional; when entered, it must be an integer between 1 and 3,600 seconds.
- No backend is currently implemented.
- One development task at a time.

---

13. Change log

- 2026-10-18: Initial project reference created. Step 1 briefed.
- 2026-10-18: Open points resolved: counter behavior retained, fixed daily goal, and deletion removes only one selected entry.
- 2026-10-18: Step 1 partially completed; "style.css" uploaded.
- 2026-10-18: Step 1 completed and confirmed working. Service Worker cache at v2.
- 2026-10-18: Reference corrected: no "js/utils.js"; shared helpers remain in "js/water.js".
- 2026-10-18: Step 2 implementation notes added.
- 2026-11-01: Step 2 — Toilet visits completed, tested in the browser including offline operation, and merged into "main" through PR #5.
- 2026-11-03: Documentation reorganized: this specification replaces the previous "acqua-reference-1.md"; "README.md" serves as the repository introduction.
