# Acqua Tracker: Project Reference

Single source of truth for requirements and build structure.
Update the **Change log** at the end of every finished step.

## 1. Overview
- Client-only PWA to track water intake. UI language: Italian (keep UI text in Italian).
- Live app: https://myspace-a.github.io/Acqua/
- Repo: https://github.com/myspace-a/Acqua (hosted on GitHub Pages, static files only)
- Stack: plain HTML, CSS, JavaScript. No frameworks, no build tools.

## 2. File structure

**Current (before the split)**
- `index.html` (about 620 lines, CSS and JS inline)
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`
- Excel library loaded from cdnjs (SheetJS 0.18.5)

**Target (step 1, the split)**
- `index.html` (structure only)
- `style.css`
- `js/storage.js` (load/save data, the only file that touches localStorage)
- `js/water.js` (add/delete/render water entries, progress, history)
- `js/backup.js` (Excel export/import)
- `js/main.js` (startup and button wiring)
- `lib/xlsx.full.min.js` (local copy of SheetJS 0.18.5, so export/import work offline)
- `manifest.json`, `sw.js`, icons (unchanged apart from `sw.js` updates below)

## 3. Current functional requirements (water)

**Core tracking**
- Track water intake organized by day.
- Each entry has: time, glass size (ml), number of glasses, optional note (max 60 chars).
- Multiple entries per day at different times. Delete individual entries.

**Glass sizes and quantity**
- Size options: 100, 150, 200, 250, 300, 350, 400, 500 ml. Default: 200 ml.
- Number of glasses per entry: 1 to 20 (plus/minus buttons).
- Each entry has one size plus a number of glasses. There is no separate counter per size (decided: keep this behavior).

**Daily view**
- Date picker to move between days.
- Timeline sorted by time, with a delete button per entry.
- Progress bar toward the daily goal of 2000 ml (fixed), colored red, yellow, green.
- Stats: number of entries, total glasses, first and last intake time.

**History**
- Collapsible list of all past days, with total ml and an entry summary per day.
- Tap a day to load it.

**Excel export/import**
- Columns: Data, Orario, Bicchieri, Dimensione (ml), Totale assunzione (ml), Nota.
- Import validates: file max 2 MB, max 10,000 rows, time format HH:MM, size from the predefined list, glasses 1 to 20, note max 60 chars.
- No duplicate entries on import.

**PWA**
- Installable on the Android home screen, app name "Acqua", icon: filled blue water drop.
- Works offline through the service worker.

**Security**
- No inline event handlers in HTML (use event listeners).
- `sanitize()` on all user text shown on screen.
- Validation on all imported data.
- No external data transmission: all data stays on the device.

## 4. Planned requirements: toilet visits (step 2)
- New **"Toilet" card** next to the water card.
- Fields: **time** (required, prefilled with now) and **duration in seconds** (optional). **No notes.**
- Day view: timeline of visits (time, duration if entered, delete button), **daily visit count** and **total seconds** (visits without duration add 0 seconds).
- History: each past day also shows **visit count and total seconds** next to the water total.
- Backup: toilet visits included in Excel export (second sheet) and import (same validation and no-duplicates rules).
- Stored separately from water data. Existing water data must stay untouched.

## 5. Roadmap (one step at a time)
1. Split `index.html` into several files (no change in look or behavior).
2. Toilet feature (section 4).
3. Back end: **to be defined later.** Open questions: purpose (multi-device, safer backup, sharing), where it is hosted (GitHub Pages is static only), login and privacy, offline behavior, migration of existing browser data.

## 6. Technical rules
- localStorage key for water data: `water-tracker-v2-timed`. Data format must not change without a migration, so existing history survives.
- `sw.js` currently uses `CACHE_NAME = 'tracker-acqua-v1'` with a cache-first strategy and caches only `./index.html` and `./manifest.json`.
- On **every release**: bump the cache version, and make sure every app file is in the cache list.
- Step 1 `sw.js` changes: bump to `tracker-acqua-v2`; cache `./`, `index.html`, `style.css`, all `js/` files, `lib/xlsx.full.min.js`, `manifest.json`, both icons.

## 7. Working rules
- One change at a time. Do not mix the split, the toilet feature and the back end.
- Deliver complete files, not partial patches, with simple upload steps for GitHub.
- Before each release: export an Excel backup from the app.
- This requirements chat does not write code; building happens in a separate chat.

## 8. Test checklist (before and after every release)
Add a water entry, delete one, change day, open history, export Excel, import Excel, close and reopen the app, open the app offline (airplane mode) including export and import. After the toilet feature, repeat the same for toilet visits.

## 9. Decisions on earlier open points
- Counter behavior: keep the current one (one size plus a number of glasses per entry).
- Daily goal: fixed at 2000 ml is fine.
- Deleting an entry: only the selected entry is removed; identical entries stay. The current code already removes just one entry per delete, so this must not change during the split.

## 10. Change log
- 2026-10-18: reference file created. Step 1 (split) briefed, not yet built.
- 2026-10-18: open points resolved (counter behavior kept, fixed goal, delete removes one entry only).
