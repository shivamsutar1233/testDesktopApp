import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

const AppThemeProvider = ({ children }) => {
  const userPreferences = useSelector((state) => state.userPreferences);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => {
    let themeMode = userPreferences.theme;

    // Handle auto theme detection
    if (themeMode === "auto") {
      themeMode = prefersDarkMode ? "dark" : "light";
    }

    const isDark = themeMode === "dark";

    // Base theme configuration
    const baseTheme = createTheme({
      palette: {
        mode: themeMode,
        primary: {
          main: isDark ? "#4caf50" : "#2e7d32",
          light: isDark ? "#81c784" : "#60ad5e",
          dark: isDark ? "#2e7d32" : "#005005",
        },
        secondary: {
          main: "#ff9800",
          light: "#ffb74d",
          dark: "#f57c00",
        },
        background: {
          default: isDark ? "#121212" : "#f5f5f5",
          paper: isDark ? "#1e1e1e" : "#ffffff",
        },
        error: {
          main: isDark ? "#f44336" : "#d32f2f",
        },
        warning: {
          main: "#ff9800",
        },
        info: {
          main: isDark ? "#29b6f6" : "#0288d1",
        },
        success: {
          main: isDark ? "#66bb6a" : "#2e7d32",
        },
        text: {
          primary: isDark ? "#ffffff" : "#333333",
          secondary: isDark ? "#b0b0b0" : "#666666",
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize:
          userPreferences.accessibility?.fontSize === "small"
            ? 12
            : userPreferences.accessibility?.fontSize === "large"
            ? 16
            : 14,
        h1: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "2rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "2.5rem"
              : "2.25rem",
          fontWeight: 600,
        },
        h2: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "1.75rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "2.25rem"
              : "2rem",
          fontWeight: 600,
        },
        h3: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "1.5rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "2rem"
              : "1.75rem",
          fontWeight: 600,
        },
        h4: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "1.25rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "1.75rem"
              : "1.5rem",
          fontWeight: 600,
        },
        h5: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "1.125rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "1.5rem"
              : "1.25rem",
          fontWeight: 600,
        },
        h6: {
          fontSize:
            userPreferences.accessibility?.fontSize === "small"
              ? "1rem"
              : userPreferences.accessibility?.fontSize === "large"
              ? "1.25rem"
              : "1.125rem",
          fontWeight: 600,
        },
      },
      spacing:
        userPreferences.layout?.density === "compact"
          ? 6
          : userPreferences.layout?.density === "spacious"
          ? 12
          : 8,
      zIndex: {
        mobileStepper: 1000,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
        notification: 1350, // Custom z-index for notifications between modal and snackbar
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 8,
              fontWeight: 500,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: userPreferences.accessibility?.reducedMotion
                  ? "none"
                  : "translateY(-1px)",
                boxShadow: userPreferences.accessibility?.reducedMotion
                  ? "none"
                  : "0 4px 8px rgba(0,0,0,0.12)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.1)",
              transition: userPreferences.accessibility?.reducedMotion
                ? "none"
                : "all 0.3s ease-in-out",
              "&:hover": {
                transform: userPreferences.accessibility?.reducedMotion
                  ? "none"
                  : "translateY(-2px)",
                boxShadow: isDark
                  ? "0 8px 24px rgba(0,0,0,0.4)"
                  : "0 8px 24px rgba(0,0,0,0.15)",
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              ...(userPreferences.accessibility?.highContrast && {
                border: `2px solid ${isDark ? "#ffffff" : "#000000"}`,
              }),
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
              color: isDark ? "#ffffff" : "#333333",
              boxShadow: isDark
                ? "0 2px 4px rgba(0,0,0,0.3)"
                : "0 2px 4px rgba(0,0,0,0.1)",
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
              borderRight: isDark ? "1px solid #333333" : "1px solid #e0e0e0",
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              margin: "4px 8px",
              "&.Mui-selected": {
                backgroundColor: isDark
                  ? "rgba(76, 175, 80, 0.2)"
                  : "rgba(46, 125, 50, 0.1)",
                "&:hover": {
                  backgroundColor: isDark
                    ? "rgba(76, 175, 80, 0.3)"
                    : "rgba(46, 125, 50, 0.15)",
                },
              },
            },
          },
        },
      },
    });

    return baseTheme;
  }, [userPreferences, prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
