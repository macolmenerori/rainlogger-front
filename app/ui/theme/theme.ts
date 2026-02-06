import { createTheme, type Theme } from '@mui/material/styles';

import themeConfig from './theme.json';

const { mode: _mode, ...paletteColors } = themeConfig.palette;

const darkPalette = {
  mode: 'dark' as const,
  ...paletteColors
};

const commonThemeSettings = {
  typography: {
    fontFamily: themeConfig.typography.fontFamily
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    }
  }
};

export const createAppTheme = (mode: 'dark' | 'light' = 'dark'): Theme => {
  const palette = mode === 'dark' ? darkPalette : darkPalette;

  return createTheme({
    palette,
    ...commonThemeSettings
  });
};

export const appTheme = createAppTheme('dark');
