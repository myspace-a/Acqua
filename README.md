# Aqua Tracker

Aqua Tracker is a lightweight, installable Progressive Web App (PWA) for tracking daily water intake and bathroom visits.

**Live application:** https://myspace-a.github.io/Acqua/

## Purpose

Aqua Tracker provides a simple way to record and review:

- Water intake
- Bathroom visits
- Daily history and statistics
- Excel backups and restore
- Offline use

The application is designed primarily for mobile devices and stores tracking data locally in the browser.

## Current features

- Water intake tracking
- Bathroom visit tracking
- Daily timelines and statistics
- History by date
- Excel import and export
- Offline operation
- Installable PWA
- Italian and English interface

## Project status

The core tracking functionality is complete:

- **Phase 1 — Application foundation and water tracking:** completed
- **Phase 2 — Bathroom visit tracking:** completed and merged into `main`
- **UI redesign:** requirements and approved mock-ups completed; implementation not yet completed
- **Backend:** future investigation; not currently implemented

## Technology

Aqua Tracker intentionally uses a simple client-side architecture:

- HTML
- CSS
- Plain JavaScript
- Browser `localStorage`
- SheetJS for Excel import/export
- Service Worker for offline support
- GitHub Pages for hosting

There is currently no application backend or user account system.

## Documentation

The project documentation is organized into three complementary documents:

- [`PROJECT_SPEC.md`](PROJECT_SPEC.md) — authoritative project requirements, technical constraints, decisions and project status
- [`docs/UI/UI_DESIGN.md`](docs/UI/UI_DESIGN.md) — UI redesign and visual design reference
- `docs/UI/mockups/` — approved UI mock-up images

Use `PROJECT_SPEC.md` as the authoritative source when requirements or decisions need to be checked.

## Using the application

Open the [live application](https://myspace-a.github.io/Acqua/) in a compatible browser.

On a compatible mobile device, the application can be installed using the browser's installation or "Add to Home Screen" functionality.

Tracking data is stored locally on the device and browser being used. Regular Excel backups are therefore recommended, especially before clearing browser data or changing device/browser.

## Repository

GitHub repository:

https://github.com/myspace-a/Acqua
