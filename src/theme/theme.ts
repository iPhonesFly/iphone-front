import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF', // Apple Blue
      light: '#5AC8FA',
      dark: '#0056CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8E8E93',
      light: '#C7C7CC',
      dark: '#636366',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#000000', // Apple Black
      paper: '#1C1C1E', // Apple Dark Gray
    },
    surface: {
      main: '#2C2C2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
    },
    divider: '#38383A',
    success: {
      main: '#30D158',
    },
    warning: {
      main: '#FF9F0A',
    },
    error: {
      main: '#FF453A',
    },
    info: {
      main: '#64D2FF',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
  },
  shape: {
    borderRadius: 12, // Apple's rounded corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1C1E',
          borderRadius: 16,
          border: '1px solid #38383A',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 40px rgba(0, 122, 255, 0.15)',
            borderColor: '#007AFF',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#007AFF',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 122, 255, 0.3)',
          '&:hover': {
            backgroundColor: '#0056CC',
            boxShadow: '0 6px 30px rgba(0, 122, 255, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#38383A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(142, 142, 147, 0.1)',
            borderColor: '#8E8E93',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(28, 28, 30, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #38383A',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#2C2C2E',
            '& fieldset': {
              borderColor: '#38383A',
            },
            '&:hover fieldset': {
              borderColor: '#8E8E93',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
            },
          },
        },
      },
    },
  },
});

// Extend the theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    surface: Palette['primary'];
  }

  interface PaletteOptions {
    surface?: PaletteOptions['primary'];
  }
}