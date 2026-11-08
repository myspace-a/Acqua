# Aqua Tracker — UI Design Reference

This document is the visual and interaction design reference for the Aqua Tracker UI redesign.

It explains how the approved product requirements are presented and organized visually.

The authoritative requirements and application behavior are defined in [`PROJECT_SPEC.md`](../../PROJECT_SPEC.md).

If this document appears to conflict with `PROJECT_SPEC.md`, the project specification takes precedence.

---

## 1. Purpose

The UI redesign aims to make Aqua Tracker:

- More compact
- Easier to understand
- Better suited to mobile screens
- Faster to use for frequent entries
- Visually clearer between water and bathroom tracking
- Easier to navigate between entry and summary information

The redesign keeps the existing dark visual direction while improving spacing, hierarchy and information organization.

The redesign does not change the underlying tracking architecture.

---

## 2. Design Principles

### 2.1 Mobile first

The interface should prioritize a phone-sized screen.

Controls should be easy to reach and understand without requiring unnecessary scrolling.

### 2.2 Compactness

The current large header and inefficient spacing should be reduced.

The redesign should use vertical space efficiently while keeping controls readable and accessible.

### 2.3 Clear visual hierarchy

The user should be able to immediately distinguish:

1. Current date
2. Water entry
3. Bathroom entry
4. Water timeline
5. Bathroom timeline
6. Daily statistics
7. Historical information

### 2.4 Strong water/bathroom distinction

Water and bathroom functions should not look like interchangeable forms.

The visual language must make their difference immediately obvious.

### 2.5 Consistency

The same visual identity should be maintained across:

- Input section
- Timeline
- Statistics

for each tracking type.

### 2.6 Minimal cognitive load

Frequent actions should require as little visual interpretation as possible.

Controls should be compact, predictable and grouped according to their function.

---

# 3. Overall Visual Language

The existing dark visual style is retained.

The redesign focuses on:

- Reduced unused space
- Compact controls
- Clear section boundaries
- Stronger color identity
- Consistent icons
- Better mobile proportions

The visual redesign should avoid introducing unnecessary decorative elements.

---

# 4. Water Visual Identity

Water uses a **blue** visual identity.

The blue identity should be visible consistently in:

- Water input section
- Water timeline
- Water statistics
- Section borders or accents
- Water-related icons

A **water-glass icon** is used to reinforce the identity.

The icon should be visually associated with the relevant section title rather than acting as a separate navigation element.

### Water terminology

The approved labels are:

- `Water` — input section
- `Water Intake` — timeline
- `Total Water Intake` — statistics

Italian equivalents are defined in `PROJECT_SPEC.md`.

---

# 5. Bathroom Visual Identity

Bathroom uses a **green** visual identity.

The green identity should be visible consistently in:

- Bathroom input section
- Bathroom timeline
- Bathroom statistics
- Section borders or accents
- Bathroom-related icons

A **toilet icon** is used to reinforce the identity.

The icon should be visually associated with the bathroom section title.

### Bathroom terminology

The approved labels are:

- `Bathroom` — input section
- `Bathroom Visits` — timeline
- `Visit Summary` — statistics

Italian equivalents are defined in `PROJECT_SPEC.md`.

---

# 6. Header

The header should be significantly more compact than the existing design.

The redesign should avoid using a large decorative logo or icon that consumes excessive vertical space.

The hamburger menu is the primary navigation mechanism.

The header should provide access to the main application menu without competing visually with the tracking controls.

---

# 7. Hamburger Menu

The hamburger menu is the main application menu.

The redundant three-dot settings control from the earlier design is not part of the approved navigation direction.

The menu presents the main secondary functions:

- Excel Backup / Backup Excel
- Settings / Impostazioni
- Language / Lingua
- Information / Informazioni

The language control should be clearly identifiable as a language-selection function.

## Layout Selection

The hamburger menu provides access to the user's layout preference.

The user can choose between:

- **Single-page**
- **Two-tab**

The selected layout should be presented as the active/current choice.

Changing the selection switches the application immediately.

The single-page layout is the default presentation for a new installation. The selected layout is remembered between application openings.

The detailed behavioral requirements for layout selection and persistence are defined in `PROJECT_SPEC.md`.

---

# 8. Date Selector

Date selection is a central navigation element and should use less vertical space than the previous design.

The date selector should remain visually prominent without dominating the screen.

When the two-tab layout is used, the date selector appears on both tabs.

Both date selectors represent the same selected date.

Changing the date in one location should immediately be reflected in the other.

---

# 9. Water Input

The water input section is visually identified using:

- Blue accent/border
- Water-glass icon
- Compact controls

The water volume controls are presented as a compact grid or grouped set of selectable buttons.

The six volume choices are:

- 100 ml
- 150 ml
- 200 ml
- 250 ml
- 300 ml
- 400 ml

The selected volume should be visually highlighted.

The controls should not stretch unnecessarily across the entire width of the screen.

### Water note

The redesigned Water input does not contain a note field.

The input area should remain focused on the frequent water-registration actions: time and volume.

No additional control for adding notes should be displayed.

### Remembered volume

The interface should visually communicate the currently selected volume.

When the application remembers the previous selection, that value appears preselected rather than requiring the user to choose it again.

### Glass counter

The glass counter is not shown in the default configuration.

When the user enables it through Settings, the counter becomes available as an additional compact control.

The presence or absence of the counter must not change the overall identity of the water section.

---

# 10. Bathroom Input

The bathroom input section uses:

- Green accent/border
- Toilet icon
- Compact controls

The section should be visually distinct from the water input section even though the overall component structure remains consistent.

This distinction is particularly important because the user previously experienced accidental selection of the wrong entry section.

Existing time and optional duration interactions should remain familiar while being presented more compactly.

---

# 11. Compact Controls

Time and quantity controls should avoid consuming the entire horizontal width when they can be grouped.

Related controls should be placed next to each other where the available mobile width permits.

The design should prioritize:

- Short controls
- Clear labels
- Compact spacing
- Easy touch targets
- Consistent alignment

The design should not sacrifice usability merely to minimize size.

---

# 12. Input and Summary Layout

The approved redesign supports two presentation models.

## 12.1 Single-page layout

The single-page design presents the main information in one vertically scrolling page.

The intended information hierarchy is:

1. Compact header
2. Date selector
3. Water input
4. Bathroom input
5. Water timeline
6. Bathroom timeline
7. Water statistics
8. Bathroom statistics
9. Collapsible History

The exact visual grouping may be adjusted during implementation as long as the approved requirements and visual hierarchy are preserved.

## 12.2 Two-tab layout

The approved two-tab reference uses:

### Input

Contains:

- Date selector
- Water input
- Bathroom input

### Summary

Contains:

- Date selector
- Water intake timeline
- Water statistics
- Bathroom visits timeline
- Bathroom statistics
- Collapsible History

The two tabs use the same underlying data.

Switching tabs must not imply a change of selected date or tracking data.

---

# 13. Timeline Design

Timelines should be easy to scan vertically.

Each timeline entry should provide sufficient dedicated space for:

- Time
- Relevant value such as ml or duration
- Delete action

The delete control must have its own space.

It must never overlap:

- Water volume
- Duration
- Other entry information

### Water timeline

The timeline is identified as **Water Intake** and uses the blue identity.

Each individual entry displays its actual intake time and water volume.

The redesign does not display separate first-intake or last-intake indicators.

The timeline should therefore focus on the individual registrations rather than additional first/last summary information.

### Bathroom timeline

The timeline is identified as **Bathroom Visits** and uses the green identity.

The two timelines should have a visually consistent structure while retaining their different color/icon identities.

---

# 14. Statistics Design

Daily statistics should be visually associated with the corresponding tracking type.

### Water statistics

Uses:

- Blue identity
- Water-glass icon
- `Total Water Intake`

The statistics area should focus on the daily water total and other approved daily statistics.

Separate first-intake and last-intake indicators are not part of the redesigned statistics presentation.

### Bathroom

Uses:

- Green identity
- Toilet icon
- `Visit Summary`

Statistics should be compact but remain readable.

The redesign should avoid unnecessary empty space or oversized cards.

---

# 15. History

History is a retained part of the Aqua Tracker experience and should remain available in the redesigned UI.

The redesign preserves the useful interaction from the existing application: the History section can be **expanded or collapsed** by the user.

When expanded, History presents a compact list of historical days with the relevant combined water and bathroom information.

The History component should:

- Remain visually secondary to the current day's tracking information.
- Use compact rows to avoid excessive vertical space.
- Clearly distinguish the date from the daily totals.
- Allow the user to expand or collapse the historical list.
- Allow the user to select a historical day and review that day's records.
- Combine water and bathroom information rather than creating separate history sections.

### Single-page layout

In the single-page layout, History is positioned after the current-day timelines and statistics.

The intended order is:

1. Water timeline
2. Bathroom timeline
3. Water statistics
4. Bathroom statistics
5. **History — collapsible**

### Two-tab layout

In the two-tab layout, History belongs to the **Summary** tab.

The Summary structure is:

1. Date selector
2. Water Intake timeline
3. Water statistics
4. Bathroom Visits timeline
5. Bathroom statistics
6. **History — collapsible**

### Existing UI reference

The existing application already provides a useful collapsible History interaction.

The old-layout screenshots stored under `docs/UI/Old Layouts/` are reference material for preserving this interaction.

The old visual styling is not authoritative. The redesigned History component should follow the new UI visual language and the layout principles defined in this document.

The History section is a UI presentation of the historical functionality defined in `PROJECT_SPEC.md`; it does not introduce new historical data or behavior.

----

# 16. Navigation and Interaction Principles

The UI should make the following interactions obvious:

- Select a date
- Record water
- Record a bathroom visit
- Delete an individual entry
- Switch between Input and Summary
- Expand or collapse History
- Select a historical day
- Open the hamburger menu
- Change language
- Open Settings
- Access Excel backup

The interface should avoid duplicate navigation mechanisms for the same function.

---

# 17. Language Presentation

The application supports Italian and English.

Italian is the default language.

The language-selection control is accessed from the hamburger menu.

The visual design should accommodate both languages without relying on fixed widths that would cause text to overlap or become truncated.

Controls and cards should therefore allow reasonable text expansion.

Approved terminology is defined in `PROJECT_SPEC.md`.

---

# 18. Responsive and Mobile Guidance

The primary design target is a mobile screen.

The implementation should:

- Use available horizontal space efficiently
- Avoid unnecessary full-width controls
- Keep touch targets usable
- Prevent text overlap
- Prevent action buttons from covering information
- Allow sections to grow vertically when necessary
- Avoid horizontal scrolling for normal application use

The layout should remain usable across different mobile screen widths.

---

# 19. Mock-ups
The mock-ups are visual references for the approved redesign.

They do not replace the written requirements in `PROJECT_SPEC.md`.

The mock-ups for new version are stored under:

```text
docs/UI/mockups/
```

### Approved two-tab reference

The approved two-tab reference illustrates:

- Input tab
- Summary tab
- Water visual identity
- Bathroom visual identity
- Compact controls
- Date selection
- Timelines
- Daily statistics

Expected file:

```text
docs/UI/mockups/mock up 2 tabs aqua tracker.png
```

### Approved single-page reference

A separate mock-up illustrates the single vertically scrolling presentation.

Expected file:

```text
docs/UI/mockups/mock up single-page aqua tracker.png
```

---

# 20. Relationship with Project Specification

The separation between the two documents is intentional.

`PROJECT_SPEC.md` defines:

- What the application must do
- What data must be preserved
- What behavior is required
- Which product decisions are approved
- Technical constraints

This document defines:

- How the approved UI organizes the information
- How water and bathroom functions are visually distinguished
- How the approved layouts are structured
- How icons and visual identities are used
- How the mock-ups represent the design direction

This document must not introduce new functional behavior that is not approved in `PROJECT_SPEC.md`.

---

# 21. Design Status

The UI redesign design work is **approved and ready for implementation**.

The following are complete:

- UI redesign requirements
- Visual direction
- Water visual identity
- Bathroom visual identity
- Terminology decisions
- Language design direction
- Layout concepts
- Approved mock-up references

The UI redesign itself is **not yet implemented**.

Implementation should be treated as a separate development task and must be tested against `PROJECT_SPEC.md` and this design reference.
