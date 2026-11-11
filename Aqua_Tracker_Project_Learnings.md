# Project Learnings

This document captures the main lessons learned while developing and evolving Aqua Tracker. It is intended as a reference for future releases and future projects.

## 1. AI-Assisted Development

### 1.1 Repository access

ChatGPT can read and work with the GitHub repository even with a free account. This was less reliable with Claude Sonnet during this project.

### 1.2 Separate AI conversations by responsibility

Using dedicated chats for different activities worked well:

- Requirements and backlog
- Project coaching
- UI design
- Build / implementation

Keeping these responsibilities separate reduces the risk of mixing requirements, implementation decisions and troubleshooting.

### 1.3 Chat is not the project source of truth

AI conversations are useful for exploring ideas, asking questions and making decisions, but important decisions need to be transferred into project documentation.

A decision discussed in a chat should not be considered part of the project until it has been recorded in the project documentation.

### 1.4 Keep the repository state authoritative

AI conversation context and repository contents can become out of sync. The actual repository should therefore be checked before starting implementation or making important decisions.

### 1.5 Review AI-generated implementation

AI-generated code should be reviewed before merging. The code review performed before merging the Aqua Tracker feature was useful even though the feature subsequently passed user testing.

### 1.6 Constrain build tasks

Implementation tasks work better when they have:

- A clearly defined scope
- Explicit requirements
- A known starting branch/state
- Clear files or areas that may be changed
- Explicit constraints

A repeatable workflow emerged:

**requirements → design → latest main → feature branch → AI implementation → review → user testing → PR → merge**

### 1.7 Codex CLI vs Codex Cloud

Codex CLI is useful for implementing changes directly in the Linux development environment and Git repository. Manually copying AI-generated files into GitHub would be unnecessarily cumbersome.

A possible future improvement is evaluating whether a paid account and Codex Cloud would improve the workflow. This has not yet been established.

Because the workflow uses both mobile and Linux, any future tool should be evaluated against the complete workflow rather than only the coding experience.

---

## 2. Requirements and Decision Management

### 2.1 Requirements, decisions, bugs and questions are different types of information

The project should distinguish between:

- **Requirements** — what the application should do
- **Decisions** — choices made about how or why something should work
- **Bugs / issues** — things that are wrong or need investigation
- **Open questions** — things that still need to be decided
- **Lessons learned** — knowledge gained from the development process

Keeping these categories separate makes the project easier to understand and maintain.

### 2.2 Long chats are not an effective decision database

Individual decisions can be related to other decisions and requirements. As conversations become long, finding the original decision becomes increasingly difficult.

A dedicated decision/issue tracking system may therefore become useful as the project grows.

### 2.3 Consider a dedicated project tracking tool

GitHub Markdown files are sufficient for a small project, but a tool such as Jira may become useful for tracking:

- Requirements
- Decisions
- Bugs
- Open questions
- Dependencies
- Work items

The tool should complement, not replace, the project's source-of-truth documentation.

---

## 3. UI Design

### 3.1 Use a dedicated UI design phase

A dedicated UI design phase before rewriting the application helps reduce redesign during implementation.

The Aqua Tracker UI redesign workflow was:

1. Discuss UI requirements in an AI chat.
2. Provide screenshots of the existing application.
3. Store screenshots of the old layout in GitHub for reference.
4. Generate and discuss proposed new layouts.
5. Store the selected/proposed layouts in GitHub for the build phase.
6. Create a consolidated UI requirements document.
7. Implement the redesign only after the design direction was established.

### 3.2 Preserve visual references

Screenshots of both the old and proposed layouts are useful project artifacts. They provide a reference that is easier to understand than written descriptions alone.

### 3.3 Evaluate dedicated UI design tools

The AI-assisted UI workflow worked, but the best dedicated UI design tool/workflow has not yet been determined.

This should be evaluated before a future major UI redesign.

---

## 4. Development and Git Workflow

### 4.1 Do not develop directly on main

Start implementation from the latest `main` branch and use a dedicated feature branch.

### 4.2 Use pull requests and review

Even for a solo project, the following workflow provides useful control:

**feature branch → implementation → review → testing → pull request → merge**

### 4.3 Git is also a recovery mechanism

Git history is valuable not only for collaboration but also for recovering from unsuccessful experiments or changes.

Documentation should be committed to Git as well as source code.

### 4.4 Keep documentation synchronized

Project documentation can become outdated even when the online repository contains newer information. Before starting work, verify that the local repository and the authoritative online repository are synchronized.

---

## 5. Testing and QA

### 5.1 Manual testing was sufficient for the current release

The redesigned application was successfully tested manually and no significant issues were encountered during user testing.

However, this may not remain sufficient as the application becomes more complex.

### 5.2 Introduce automated unit testing when justified

Automated unit tests should be evaluated for future releases, particularly for logic involving:

- Data handling
- Calculations
- Date processing
- Import/export
- Storage
- Data migration

The effort should be assessed against the size and complexity of the project.

### 5.3 Automated user testing is worth investigating

Automated end-to-end/user testing may not provide a large practical benefit for a small application, but implementing some automated user tests could be valuable as a learning exercise.

### 5.4 Create and store a repeatable test library

The project currently does not have a dedicated test script/library stored in the repository.

A future improvement should be to create a documented test checklist or test library covering the important application workflows.

### 5.5 Regression testing must include existing data

Testing should not only verify new functionality. For an application containing persistent user data, regression testing should also verify that existing data remains correct.

Important areas include:

- Existing water data
- Toilet data
- Editing
- Deleting
- Import/export
- Dates
- Offline behavior
- PWA/service-worker behavior
- Compatibility with previous data formats

### 5.6 Testing should be part of the development workflow

A useful release workflow is:

**implementation → AI/code review → browser testing → data testing → pull request → merge**

Testing should not be treated as an optional final activity.

---

## 6. Data and Storage Architecture

### 6.1 Browser storage is not equivalent to application storage

Using `localStorage` is convenient for a simple PWA, but it is fundamentally different from using a backend database or cloud storage.

The data is associated with the browser/device environment rather than with a user account.

### 6.2 Storage architecture affects future migration

The use of browser-local storage creates limitations around:

- Moving to another device
- Changing browsers
- Reinstalling the application
- Clearing browser data
- Recovering lost data
- Sharing data between devices

Storage architecture should therefore be considered early in the project.

### 6.3 Backup and restore become important without a backend

When there is no server-side copy of the user's data, backup/restore can become a core reliability feature rather than merely a convenience feature.

### 6.4 Data migration needs explicit consideration

Changes to the data model should consider compatibility with existing data. Future releases should define how old data will be preserved or migrated.

---

## 7. Development, Test and Production Environments

### 7.1 The current architecture does not clearly separate environments

Aqua Tracker currently does not have a clearly defined distinction between:

- Development
- Test/staging
- Production

This should be addressed in the future architecture.

### 7.2 Environment separation does not necessarily require three servers

For a small static PWA, three completely independent environments may be unnecessary.

The important point is to define what each environment represents and how changes move between them.

A possible model is:

- **Development** — local Linux environment where development and experiments happen.
- **Test/staging** — a deployment used to test a candidate release.
- **Production** — the public/live application used with real data.

### 7.3 Separate environments are particularly important because data is browser-local

Aqua Tracker's lack of a backend makes environment management less obvious, but the browser-local storage model creates a specific risk: experimental code may be tested using the same browser storage as production data.

Future architecture should make it difficult to accidentally test experimental releases against real production data.

### 7.4 Code environment and data environment are different

Aqua Tracker currently has no separate database for development, test and production.

The current situation is effectively:

**development/test/production code → browser-local data**

This distinction should be considered explicitly when designing the future storage architecture.

---

## 8. PWA-Specific Lessons

### 8.1 A PWA is not the same as a traditional installed application

A PWA hosted on GitHub Pages can behave like an installed application, but its installation and storage mechanisms are still controlled by the browser/platform.

### 8.2 Installation and migration need dedicated testing

PWA installation behavior can differ between devices and browsers. Moving an installed PWA from one phone to another is not necessarily equivalent to installing a native Android application.

PWA installation/migration should therefore be tested separately from normal application functionality.

### 8.3 Similar PWAs can behave differently

Two PWAs hosted using similar infrastructure can have different installation behavior because of differences in their manifests, service workers, browser state and other PWA characteristics.

---

## 9. Documentation and Project Knowledge

### 9.1 Maintain three levels of project knowledge

A useful model is:

**AI conversation**
→ exploration, questions, alternatives and discussion

**Project documentation**
→ approved requirements, decisions, architecture and test procedures

**Code**
→ actual implementation

These three levels need to remain synchronized.

### 9.2 Documentation is part of the product

Project documentation should be version controlled alongside the code.

Important documentation includes:

- Requirements
- Architecture
- UI specification
- Decisions
- Testing procedures
- Known limitations
- Lessons learned
- Development workflow

### 9.3 Record lessons learned separately from requirements

Lessons learned describe what was discovered during development. They should not automatically become application requirements.

Some lessons may later lead to new requirements, architecture changes or process improvements.

---

## 10. Reusable Development Process

The Aqua Tracker project has produced a reusable high-level process:

1. **Explore** — discuss the problem and alternatives with AI.
2. **Define requirements** — record approved requirements.
3. **Make design decisions** — record important decisions.
4. **Design UI** — use screenshots and visual references where appropriate.
5. **Review architecture** — consider storage, environments, deployment and migration.
6. **Prepare implementation** — start from the latest `main`.
7. **Create feature branch**.
8. **Implement with AI/Codex**.
9. **Review the implementation**.
10. **Run manual and automated tests**.
11. **Test existing data and regression scenarios**.
12. **Review the pull request**.
13. **Merge into `main`**.
14. **Deploy and perform production checks**.
15. **Record new lessons learned**.

This process should be refined as future releases provide more experience.
