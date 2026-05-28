---
name: RainLogger
description: Dark-mode rainfall monitoring PWA. Navy backgrounds, cyan brand accent, Roboto typography, MUI 7 component library.
colors:
  primary: "#41c3fb"
  primary-light: "#74f6ff"
  primary-dark: "#0e90c8"
  secondary: "#f4de90"
  error: "#f44336"
  warning: "#ff9800"
  info: "#2a26f7"
  success: "#66bb6a"
  background-default: "#1a2332"
  background-paper: "#27303f"
  text-primary: "#ffffff"
  text-secondary: "rgba(255,255,255,0.7)"
  neutral-chart-grid: "#3a4556"
  neutral-chart-axis: "#aaaaaa"
  neutral-muted: "#888888"
typography:
  display:
    fontFamily: Roboto
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.167
    letterSpacing: -0.01em
  title:
    fontFamily: Roboto
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.0075em
  subtitle:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0.00938em
  body:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.00938em
  button:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0.02857em
  caption:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.66
    letterSpacing: 0.03333em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background-default}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    textTransform: none
    fontWeight: 500
  button-text:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    textTransform: none
  button-outlined:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    textTransform: none
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    textTransform: none
  card:
    backgroundColor: "{colors.background-paper}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    maxWidth: 400px
  text-field:
    backgroundColor: "{colors.background-paper}"
    borderColor: "{colors.neutral-chart-grid}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  tab:
    selectedColor: "{colors.primary}"
    indicatorColor: "{colors.primary}"
    textTransform: uppercase
  app-bar:
    backgroundColor: "{colors.background-paper}"
    textColor: "{colors.primary}"
    height: 64px
    position: sticky
  alert:
    variant: filled
    position: bottom-center
    autoHideDuration: 5000ms
---

# RainLogger Design

## Overview

RainLogger is a dark-mode, mobile-first Progressive Web App for logging and reviewing daily rainfall measurements. The design language is calm and data-focused: deep navy backgrounds create a nighttime / overcast sky atmosphere; a single vivid cyan accent (`#41c3fb`) carries all interactive and data-highlight moments; generous whitespace and clean Roboto typography keep dense tabular data readable at a glance.

The aesthetic targets practical utility over decoration. Minimal visual noise lets the data — dates, measurements, calendar views, bar charts — speak. Every screen works on mobile (390px+) and scales gracefully to desktop without layout shifts or horizontal scrolling.

**Personality keywords:** precise, calm, trustworthy, outdoor/meteorological, utility-first.

## Colors

### Palette

| Token | Hex | Role |
|---|---|---|
| `primary` | `#41c3fb` | Brand accent, interactive controls, data highlights |
| `primary-light` | `#74f6ff` | Hover / focus states on primary elements |
| `primary-dark` | `#0e90c8` | Active / pressed states on primary elements |
| `secondary` | `#f4de90` | Supplementary accent (use sparingly; reserved for future states) |
| `error` | `#f44336` | Destructive actions, validation errors |
| `warning` | `#ff9800` | Non-critical alerts |
| `info` | `#2a26f7` | Informational messages |
| `success` | `#66bb6a` | Successful operations |
| `background-default` | `#1a2332` | Page background, PWA theme-color meta tag |
| `background-paper` | `#27303f` | Surface layer: cards, AppBar, table, tab panels |
| `text-primary` | `#ffffff` | Primary text on dark surfaces |
| `text-secondary` | `rgba(255,255,255,0.7)` | Secondary / supporting text, labels |
| `neutral-chart-grid` | `#3a4556` | Chart gridlines, axis lines, input borders |
| `neutral-chart-axis` | `#aaaaaa` | Chart axis tick labels, chart tooltip text |
| `neutral-muted` | `#888888` | Zero-value or de-emphasized data annotations |

### Usage rules

- **Primary (`#41c3fb`)** is the sole interactive color. Use it for: contained buttons, active tab indicators, navbar title/link, data values in the summary card, bar chart fills, calendar measurement annotations with non-zero values. Do not use it decoratively for borders or backgrounds.
- **Background-default** sits behind everything. **Background-paper** is the next layer up: cards, the AppBar, data containers (table, calendar, chart). Avoid adding a third tonal layer without design review.
- **Neutral chart tokens** (`neutral-chart-grid`, `neutral-chart-axis`, `neutral-muted`) exist exclusively for third-party visualization libraries (Recharts, `@macolmenerori/component-library`) that cannot read MUI theme tokens. Always reference these constants rather than inlining bare hex values.
- **Error (`#f44336`)** is reserved for destructive actions (delete button) and form validation messages. Never use it for general warnings.
- The app is **dark-mode only**. Do not author light-mode styles until a separate light palette has been designed.

## Typography

All text uses **Roboto** (weights 300, 400, 500, 700 loaded via `@fontsource/roboto`).

### Type scale

| Role | MUI variant | Size | Weight | Usage |
|---|---|---|---|---|
| `display` | `h3` | 48px | 700 | Page titles (New Log, Watch Logs, etc.) |
| `title` | `h6` | 20px | 500 | Navbar app name, summary card value |
| `subtitle` | `h4` | 34px | 400 | Login page heading |
| `body` | `body1` | 16px | 400 | Form labels, table cell content, general prose |
| `button` | — | 14px | 500 | Button labels (no text-transform) |
| `caption` | `caption` | 12px | 400 | Helper text, tooltips, secondary info |

### Rules

- **`fontWeight: 700` is reserved** for the `display` role (page titles). Do not apply it ad hoc to body copy, labels, or other elements.
- **No `textTransform`** on any button or tab label. All labels render in sentence or title case as written.
- Line height and letter spacing follow MUI defaults for each variant — do not override unless a specific layout constraint requires it.
- Roboto 300 (light) is loaded but currently unused in the component tree; it is available for future de-emphasized or large-display text.

## Layout

### Grid model

No MUI `Container` component is used. Layout is built entirely from `Box` flex columns with explicit `maxWidth` constraints on content elements. This keeps the code lean and avoids extra nesting.

### Page shell

- The sticky `AppBar` is always **64px** tall. Protected-route pages offset their content area with `minHeight: calc(100vh - 64px)`.
- Vertically centered pages (MainPage, Login) additionally use `justifyContent: center`.
- Top-aligned pages (NewLog, WatchLogs) use `py: 3` top padding and align content to the top.

### Content-width scale

Use these named widths consistently — do not introduce arbitrary maxWidth values:

| Name | Value | Used for |
|---|---|---|
| `card` | 400px | Login card |
| `table` | 450px | Data table, summary card, calendar tab |
| `form` | 600px | New-log and update-log forms |
| `chart` | 700px | Bar chart container |
| `filters` | 800px | WatchLogs filter bar |

### Spacing

All spacing follows the **8px base grid** via MUI's default spacing function (1 unit = 8px). Use only multiples: `xs` (4px = 0.5), `sm` (8px = 1), `md` (16px = 2), `lg` (24px = 3), `xl` (32px = 4). Do not use half-multiples or arbitrary pixel values in `sx` props.

### Responsive breakpoints

- Mobile cutoff: **`sm` (600px)**. Below `sm` is mobile, `sm` and above is desktop.
- Form rows: `flexDirection: { xs: 'column', sm: 'row' }` with `gap: md`.
- Navbar: hamburger menu + `Drawer` (width 250px) on mobile; inline controls on desktop.
- Content widths apply only at `sm+` — on `xs` elements stretch to full width.

## Elevation & Depth

Depth is communicated through **tonal layering** rather than drop shadows:

1. `background-default` (`#1a2332`) — base layer, page background.
2. `background-paper` (`#27303f`) — raised surfaces: AppBar, cards, data containers.

MUI's default elevation-based gradient on the AppBar is explicitly neutralized (`backgroundImage: 'none'`) so the flat paper color reads cleanly.

The **summary card** (MonthlyRainfall) uses `elevation={1}` (a subtle shadow) to lift it slightly above the surrounding content and give it visual prominence as a key metric. This is the only deliberate use of box-shadow in the design.

Dialog modals (UpdateLogModal, ConfirmDeleteModal) use MUI's default backdrop + elevation to establish a modal layer; do not customize dialog elevation.

## Shapes

| Token | Value | Usage |
|---|---|---|
| `sm` | 4px | Chip-style labels, small inline elements |
| `md` | 8px | Buttons (`border-radius: 8px`), text fields, default component rounding |
| `lg` | 16px | Cards, Paper containers, tab panels, chart containers |
| `full` | 9999px | Pill badges (reserved for future use) |

MUI's `shape.borderRadius` is set to `8px` (the `md` token). Components that override rounding use `borderRadius: 2` in `sx` (= 2 × 8 = 16px, the `lg` token). Always express custom radii as multiples of the MUI spacing/borderRadius function rather than raw pixel values.

## Components

### Button

Four variants in use:

| Variant | Usage | Color |
|---|---|---|
| `contained` (primary) | Primary submit actions (Save, Search, Login) | `primary` background, `background-default` text |
| `text` | Navigation links (Return/Back button, desktop Logout) | `primary` text, transparent background |
| `outlined` | Secondary actions in constrained spaces (mobile drawer Logout) | `primary` border and text |
| `contained` (error) | Irreversible destructive actions (Delete log) | `error` background |

- All buttons: `textTransform: none`, `borderRadius: 8px`, `padding: 8px 16px`.
- Primary submit buttons: `variant="contained"`, `size="large"`, `fullWidth` within their container.
- **Loading state**: replace button label with `<CircularProgress size={24} />` and disable the button. Never unmount or hide the button during submission.
- Icon buttons (Edit, Delete in table rows): `size="small"`, no background — icon color inherits from `text-secondary`.

### Card / Paper

- Login card: `p: 4`, `maxWidth: 400`, `borderRadius: lg`.
- Summary card (MonthlyRainfall): `elevation={1}`, `px: 3`, `py: 2`, `borderRadius: lg`, `maxWidth: table`.
- Data containers (calendar, chart): `backgroundColor: background-paper`, `borderRadius: lg`, `p: 2`, no explicit elevation — visually equivalent to `Paper` but built from `Box` since they wrap third-party components.
- TableContainer: `component={Paper}`, `borderRadius: lg`.

### Text Field / Select

- Variant: `outlined` (MUI default outlined, dark surface).
- Always use `slotProps={{ inputLabel: { shrink: true } }}` for consistent label behavior.
- Numeric fields: add `htmlInput: { step: '0.01', min: '0' }`.
- Use `flex: 1` for fields that share a row so they grow equally.
- Keep number inputs as string-typed fields with Zod `.refine()` — do not use `z.coerce.number()` with react-hook-form (see CLAUDE.md).

### Tabs

- Icon position: `iconPosition="start"` on all tab labels.
- Active tab: `primary` text color + `primary` bottom indicator.
- Inactive tab: `text-secondary` color.
- Tab labels: uppercase (MUI default for Tabs) — this is the one exception to the no-textTransform rule.

### AppBar / Navbar

- `position="sticky"`, `backgroundColor: background-paper`, `backgroundImage: none`.
- App name: `variant="h6"`, `color: primary`, rendered as a `Link` to `/`.
- Desktop: Language switcher + Logout button inline on the right.
- Mobile (`< sm`): hamburger `MenuIcon` on the right; content in a right-anchored `Drawer` (width 250px).

### Modals / Dialogs

- Use MUI `Dialog` with `maxWidth="xs"` and `fullWidth`.
- Disable backdrop click and all controls during async submission (`disableBackdropClick` via `onClose` guard).
- Close button: `IconButton` with `CloseIcon` in the dialog title area.
- Destructive confirmation: use `color="error"` on the confirm button.

### Alerts (Toast)

- Global toast: MUI `Snackbar` (bottom-center, `autoHideDuration: 5000`) + `Alert` (`variant="filled"`).
- Single alert at a time — calling `showAlert` replaces any visible alert.
- Login page uses a local inline `Alert` (not the global system) for contextual form feedback.

### Loading States

- Full-page loading (auth check, data fetch): centered `CircularProgress` inside a full-height `Box` with `minHeight: calc(100vh - 64px)`.
- In-button loading: `CircularProgress size={24}` replacing the button label.
- Never show a blank page; always provide a loading indicator.

## Do's and Don'ts

### Do's

- **Reference theme tokens**, not hex literals. Use `theme.palette.primary.main` (or the `colors.*` tokens above) in component code. For Recharts and the calendar library (which cannot read MUI theme), import from a centralized `chartColors` constants module that maps to the `neutral-chart-*` tokens — never hardcode hex values inline.
- **Follow the content-width scale.** Use `card / table / form / chart / filters` maxWidths. If a new component needs a different width, add it to the scale with a name rather than introducing a bare pixel value.
- **Keep spacing on the 8px grid.** Prefer `gap: 2` over `gap: '15px'`.
- **Use `display` (h3, weight 700) for page titles only.** Other strong text should use `fontWeight: 500` or rely on the variant's default weight.
- **Indicate loading on every async action** — both full-page and in-button patterns, depending on context.
- **De-emphasize zero or null data visually.** In tables and calendar views, zero-value entries should use `text-secondary` or `neutral-muted` color to reduce visual noise compared to entries with measured rainfall. This is a principle — apply it when implementing new data display components.

### Don'ts

- **Don't add a light theme** until a complete light palette (background, surface, text, border) has been designed to match the dark experience. The `createAppTheme('light')` stub currently maps to dark values intentionally.
- **Don't add a third elevation layer** between `background-default` and `background-paper` without design review. Two tonal layers are sufficient for the current information hierarchy.
- **Don't introduce off-brand accent colors.** The `secondary` (`#f4de90`) palette slot exists but is not actively used. Reserve it for future deliberate use; do not reach for it to add color variety.
- **Don't use `textTransform: uppercase` or `textTransform: capitalize`** on buttons, nav links, or modal actions. Only MUI Tabs use uppercase (their default), and that is accepted.
- **Don't stack multiple alerts.** The alert system is single-instance. If a flow requires simultaneous notifications, reconsider the UX rather than extending the alert system.
- **Don't bypass the `useApi` hook** for data fetching that needs loading/error state — it handles retry, error normalization, and skip semantics consistently.
