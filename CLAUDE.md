# Family Budget App — Project Instructions

## Overview
A responsive, RTL Hebrew family budget web application built as a **single HTML file**.
Designed for two partners (שחר and רותם) with shared/per-partner expense and income tracking,
savings goals, and a dashboard with charts and financial health scoring.

## Tech Stack
- **Vanilla JS** — no frameworks, no build tools
- **Chart.js** (CDN) — dashboard visualizations (doughnut, bar, line, stacked)
- **SheetJS/xlsx** (CDN) — Excel import/export
- **Firebase** (CDN compat SDK) — Realtime Database, Google Authentication
- **Google Fonts** — Heebo (Hebrew-optimized)
- **CSS Custom Properties** — theming (light/dark mode)

## Architecture
- **Single file**: `Budget/family-budget.html` contains all HTML, CSS, and JS
- **Sections** are marked with `// ===== SECTION NAME =====` comment headers
- **Data persistence**: Firebase Realtime DB (primary) + localStorage (offline cache)
- **RTL layout**: `dir="rtl"` on `<html>`, all text and layout flows right-to-left
- **No build step**: open the file directly in a browser

## Data Model
The main data object `D` has this structure:
```js
D = {
  config: {
    partner1: 'שחר',
    partner2: 'רותם',
    children: [{ id, name, age, emoji }],
    pet: { name, enabled },
    categories: [{ id, name, icon, order, isChildrenCategory, items: [{ name, isDefault }] }],
    incomeSources: [{ name, defaultAmount }]
  },
  months: {
    'YYYY-MM': {
      expenses: { 'catName': { items: [{ name, planned, actual, isDefault, childId?, owner }] } },
      income: [{ source, amount, owner }],
      misc: { 'שוברים': 0, 'קופה קטנה': 0 },
      savingsContributions: { goalKey: amount }
    }
  },
  savings: {
    emergency: { target, current, monthlyContribution },
    goals: [{ id, name, emoji, target, current, targetDate, monthlyContribution, priority }],
    childrenSavings: [{ childId, childName, purposes, target, current, targetAge, monthlyContribution }],
    completedGoals: []
  },
  settings: { darkMode, setupComplete, currency, dismissedAlerts, subtitle }
}
```

## Key Storage Keys
- `familyBudget_v2` — main app data (localStorage cache)
- `familyBudget_firebaseConfig` — Firebase project configuration
- `familyBudget_ShacharRotem` — legacy v1 key (auto-migrated)

## Important Code Sections (approximate line ranges)
- **CSS**: lines 10–328
- **HTML body**: lines 330–449
- **Constants & state**: lines 451–494
- **Data model & persistence**: lines 505–655
- **Setup wizard**: lines 658–1052
- **Month navigation**: lines 1054–1100
- **Budget tab rendering**: lines 1100–1330
- **Dashboard & alerts**: lines 1330–1550
- **Savings tab**: lines 1550–1850
- **Admin panel**: lines 1850–2090
- **Dark mode & export/import**: lines 2090–2370
- **Firebase & init**: lines 2370–end

## Conventions
- **Hebrew text**: all user-facing strings are in Hebrew
- **Currency**: always format with `fc()` helper → `₪ 1,234`
- **Month keys**: `YYYY-MM` format (e.g., `2026-02`)
- **IDs**: generated with `uid()` → `id_xxxxxxxxx`
- **Debounced saves**: `saveData()` uses 500ms debounce
- **Owner field**: `'partner1'`, `'partner2'`, or `'shared'`
- **Toast notifications**: use `toast('message')` for user feedback
- **Modals**: use `showModal(html)` / `closeModal()`

## Testing
1. Open `Budget/family-budget.html` in Chrome/Firefox
2. Check browser console (F12) for errors
3. For Firebase features: need internet + valid Firebase config
4. For offline testing: disconnect WiFi, verify localStorage fallback

## Firebase Structure
```
/families/{familyId}/
  data/          → the D object
  meta/          → { createdAt, createdBy, lastEditedBy, lastEditedAt }
  members/{uid}/ → { email, displayName, photoURL, partnerSlot, online, lastSeen }
/userFamilies/{uid}/ → { familyId }
/invites/{code}/     → familyId
```

## Do NOT
- Break the single-file architecture
- Add npm/build dependencies
- Remove RTL support
- Hardcode partner names (use D.config.partner1/partner2)
- Skip the `saveData()` call after mutations
- Use `var` (use `let`/`const`)
