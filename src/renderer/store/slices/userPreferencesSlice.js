import { createSlice } from "@reduxjs/toolkit";

// Load preferences from localStorage
const loadPreferences = () => {
  try {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
  } catch (error) {
    console.error("Error loading user preferences:", error);
  }
  return {};
};

// Save preferences to localStorage
const savePreferences = (preferences) => {
  try {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving user preferences:", error);
  }
};

const defaultPreferences = {
  theme: "light", // 'light' | 'dark' | 'auto'
  language: "en", // 'en' | 'es' | 'fr' | 'de' | 'it'
  currency: "USD",
  timezone: "America/New_York",
  notifications: {
    email: true,
    push: true,
    lowStock: true,
    orderStatus: true,
    dailyReports: false,
  },
  layout: {
    sidebarCollapsed: false,
    density: "comfortable", // 'compact' | 'comfortable' | 'spacious'
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium", // 'small' | 'medium' | 'large'
  },
};

const initialState = {
  ...defaultPreferences,
  ...loadPreferences(),
  isLoading: false,
  error: null,
};

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    updatePreference: (state, action) => {
      const { key, value } = action.payload;
      const keys = key.split(".");

      // Handle nested properties
      if (keys.length === 1) {
        state[keys[0]] = value;
      } else if (keys.length === 2) {
        state[keys[0]][keys[1]] = value;
      }

      // Save to localStorage
      savePreferences(state);
    },

    updateMultiplePreferences: (state, action) => {
      Object.assign(state, action.payload);
      savePreferences(state);
    },

    resetPreferences: (state) => {
      Object.assign(state, defaultPreferences);
      savePreferences(state);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      savePreferences(state);
    },

    toggleSidebar: (state) => {
      state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed;
      savePreferences(state);
    },
  },
});

export const {
  updatePreference,
  updateMultiplePreferences,
  resetPreferences,
  toggleTheme,
  toggleSidebar,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
