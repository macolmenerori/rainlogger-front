# AlertContext - Error Management System

## Overview

The AlertContext provides a global notification system for the RainLogger app. It uses MUI's Snackbar + Alert components to display transient toast notifications with different severity levels. Any component in the app can trigger an alert via the `useAlert()` hook.

## Architecture

The system follows the same context pattern as `UserContext`:

```
AlertContext.tsx
├── AlertProvider    (renders children + Snackbar/Alert UI)
├── useAlert()       (hook returning showAlert function)
└── AlertContext      (React context, internal)
```

### Provider Hierarchy in `root.tsx`

```
ThemeProvider          ← MUI theme (required by Alert/Snackbar)
  └── AlertProvider    ← Global alert state + Snackbar UI
        └── UserProvider
              └── Outlet   ← All routes
```

AlertProvider sits between ThemeProvider and UserProvider because:
- It needs MUI theme context above it (Snackbar and Alert are MUI components)
- It wraps UserProvider so components interacting with user state can also show alerts

The same hierarchy is mirrored in `app/test/utils/test-utils.tsx` for testing.

## API

### `useAlert()` Hook

```typescript
import { useAlert } from '@/context/AlertContext/AlertContext';

const { showAlert } = useAlert();
```

Returns an object with a single function:

#### `showAlert(message, severity, duration?)`

| Parameter  | Type         | Default | Description                                |
|------------|--------------|---------|--------------------------------------------|
| `message`  | `string`     | —       | The text to display in the alert           |
| `severity` | `AlertColor` | —       | `'error'` \| `'warning'` \| `'info'` \| `'success'` |
| `duration` | `number`     | `5000`  | Auto-dismiss time in milliseconds          |

`AlertColor` is imported from `@mui/material`.

## Usage Examples

### Basic: Show a success or error alert

```typescript
import { useTranslation } from 'react-i18next';

import { useAlert } from '@/context/AlertContext/AlertContext';
import { ApiError } from '@/services/apiClient';

function MyComponent() {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const handleSave = async () => {
    try {
      await saveData();
      showAlert(t('components.alert.newLog.success'), 'success');
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : t('components.alert.generic.error');
      showAlert(message, 'error');
    }
  };
}
```

### With useApi hook (onError callback)

For data-fetching scenarios, the `useApi` hook supports an `onError` callback that integrates with the alert system:

```typescript
import { useAlert } from '@/context/AlertContext/AlertContext';
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { showAlert } = useAlert();

  const { data, loading } = useApi(
    () => fetchSomeData(),
    [],
    { onError: (err) => showAlert(err.message, 'error') }
  );
}
```

### Custom duration

```typescript
// Show for 10 seconds instead of the default 5
showAlert('This will stay longer', 'info', 10000);
```

### Different severity levels

```typescript
showAlert('Data saved', 'success');           // Green
showAlert('Check your input', 'warning');     // Orange
showAlert('Something went wrong', 'error');   // Red
showAlert('New version available', 'info');   // Blue
```

## Behavior

- **Auto-dismiss**: Alerts automatically disappear after the specified duration (default 5 seconds)
- **Manual close**: Each alert has a close button (X icon) for manual dismissal
- **Clickaway ignored**: Clicking outside the alert does not dismiss it (standard MUI Snackbar pattern)
- **Single alert**: Only one alert is visible at a time. Calling `showAlert` while an alert is showing replaces it immediately
- **Position**: Bottom-center of the viewport
- **Style**: `variant="filled"` for strong visual contrast against the dark theme background

## Translation Keys

Alert messages should use i18n translation keys. Available keys:

| Key | EN | ES |
|-----|----|----|
| `components.alert.newLog.success` | Rain log saved successfully | Registro de lluvia guardado correctamente |
| `components.alert.newLog.error` | Failed to save rain log | Error al guardar el registro de lluvia |
| `components.alert.generic.error` | An unexpected error occurred | Ocurrio un error inesperado |
| `components.alert.generic.networkError` | Network error. Please check your connection | Error de red. Por favor compruebe su conexion |

When adding new alert messages, add translations under `components.alert` in both `public/locales/en.json` and `public/locales/es.json`.

## Current Integration Points

| Component | Usage |
|-----------|-------|
| `app/pages/NewLog/NewLog.tsx` | Shows success alert on rain log save, error alert on failure. Submit button shows loading spinner while submitting, form resets on success. |
| `app/pages/Login/Login.tsx` | Uses its own inline `Alert` component (not the global system) — login errors are contextual to the form. |

## Design Decisions

1. **Snackbar + Alert (not just Alert)**: MUI Snackbar provides positioning, auto-dismiss timing, and transition animations. The inner Alert provides severity-based styling with theme colors.

2. **UI lives inside AlertProvider**: The Snackbar/Alert JSX is rendered inside the provider component rather than in a separate component file. This avoids an unnecessary abstraction since the UI is tightly coupled to the provider state and is minimal (~15 lines of JSX).

3. **No alert queue/stacking**: Only one alert is shown at a time. A new `showAlert` call replaces the current one. This keeps the implementation simple. If stacking is needed in the future, the state can be changed from a single `AlertState` to an array.

4. **Login page excluded**: The login page keeps its own inline `Alert` because the error is contextual — it appears inside the login card between the form fields and the submit button. A global toast would be a worse UX for form-level validation errors.
