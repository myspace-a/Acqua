Aqua Tracker

Aqua Tracker is a lightweight, installable web application for tracking daily water intake and toilet visits.

Live application: https://myspace-a.github.io/Acqua/

The application interface is in Italian.

Features

- Water tracking: record intake time, glass size, number of glasses and optional notes.
- Daily goal: monitor progress towards a fixed daily goal of 2,000 ml.
- Toilet visits: record visit times and optional duration in seconds.
- Daily history: review water intake and toilet visit statistics by date.
- Excel backup: export and import water and toilet records.
- Offline support: continue using the application without an internet connection after it has been loaded and cached.
- Installable PWA: add the application to a compatible device's home screen.

Technology

- HTML
- CSS
- Plain JavaScript
- Browser localStorage for data persistence
- SheetJS for Excel import and export
- Service Worker for offline support
- GitHub Pages for static hosting

No application backend or account is required. Tracking data is stored locally in the browser on the device being used.

Important: Browser data is device- and browser-specific. Export Excel backups regularly, especially before changing devices or clearing browser data.

Using the application

Open the "live application" (https://myspace-a.github.io/Acqua/) in your browser.

On a compatible mobile device, use the browser's installation or "Add to Home Screen" option to install the PWA.

Project documentation

See "PROJECT_SPEC.md" (PROJECT_SPEC.md) for the complete project specification, including:

- Functional requirements
- Application architecture and file structure
- Data storage and Excel backup formats
- Technical constraints and design decisions
- Testing strategy
- Development workflow and roadmap

Project status

- Step 1 — Application file separation: completed.
- Step 2 — Toilet visit tracking: completed, browser-tested (including offline operation) and merged into "main".
- Future backend: not yet defined.

Repository

https://github.com/myspace-a/Acqua