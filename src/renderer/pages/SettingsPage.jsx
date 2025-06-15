import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Store as StoreIcon,
  Language as LanguageIcon,
  Accessibility as AccessibilityIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePreference,
  resetPreferences,
} from "../store/slices/userPreferencesSlice";
import useTranslation from "../hooks/useTranslation";
import useResponsive from "../hooks/useResponsive";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";

function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userPreferences = useSelector((state) => state.userPreferences);
  const { t, getAvailableLanguages } = useTranslation();
  const { isMobile, getGridCols } = useResponsive();

  const [localSettings, setLocalSettings] = useState({
    // User Profile
    companyName: "Grocery Manager Inc.",
    contactEmail: "admin@grocerymanager.com",
    contactPhone: "+1 555-0123",
    address: "123 Business Ave, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",

    // API Settings
    apiEndpoint: "https://api.grocerymanager.com",
    timeout: 30000,
    retryAttempts: 3,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handlePreferenceChange = (key, value) => {
    dispatch(updatePreference({ key, value }));
  };

  const handleLocalSettingChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save the local settings to your backend
    console.log("Saving settings:", localSettings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetPreferences = () => {
    if (
      window.confirm(
        t(
          "settings.confirmReset",
          "Are you sure you want to reset all preferences?"
        )
      )
    ) {
      dispatch(resetPreferences());
    }
  };

  const themeOptions = [
    { value: "light", label: t("settings.light") },
    { value: "dark", label: t("settings.dark") },
    { value: "auto", label: t("settings.auto") },
  ];

  const densityOptions = [
    { value: "compact", label: t("settings.compact", "Compact") },
    { value: "comfortable", label: t("settings.comfortable", "Comfortable") },
    { value: "spacious", label: t("settings.spacious", "Spacious") },
  ];

  const fontSizeOptions = [
    { value: "small", label: t("settings.small", "Small") },
    { value: "medium", label: t("settings.medium", "Medium") },
    { value: "large", label: t("settings.large", "Large") },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        {t("settings.title")}
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t("settings.savedSuccessfully", "Settings saved successfully!")}
        </Alert>
      )}
      <Grid container spacing={3}>
        {/* Theme & Appearance Settings */}
        <Grid item xs={12} md={getGridCols(12, 6, 6)}>
          <Card>
            <CardHeader
              avatar={<ThemeIcon />}
              title={t("settings.appearance", "Appearance")}
              subheader={t(
                "settings.appearanceDesc",
                "Customize the look and feel"
              )}
            />
            <CardContent>
              <Grid container spacing={3} alignItems={"center"}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>{t("settings.theme")}</InputLabel>
                    <Select
                      value={userPreferences.theme}
                      label={t("settings.theme")}
                      onChange={(e) =>
                        handlePreferenceChange("theme", e.target.value)
                      }
                    >
                      {themeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>
                      {t("settings.density", "Layout Density")}
                    </InputLabel>
                    <Select
                      value={userPreferences.layout?.density || "comfortable"}
                      label={t("settings.density", "Layout Density")}
                      onChange={(e) =>
                        handlePreferenceChange("layout.density", e.target.value)
                      }
                    >
                      {densityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.layout?.sidebarCollapsed || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "layout.sidebarCollapsed",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t("settings.collapseSidebar", "Collapse Sidebar")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Language & Localization */}
        <Grid item xs={12} md={getGridCols(12, 6, 6)}>
          <Card>
            <CardHeader
              avatar={<LanguageIcon />}
              title={t("settings.localization", "Localization")}
              subheader={t(
                "settings.localizationDesc",
                "Language and regional settings"
              )}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>{t("settings.language")}</InputLabel>
                    <Select
                      value={userPreferences.language}
                      label={t("settings.language")}
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                    >
                      {getAvailableLanguages().map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.currency", "Currency")}
                    value={userPreferences.currency}
                    onChange={(e) =>
                      handlePreferenceChange("currency", e.target.value)
                    }
                    select
                  >
                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                    <MenuItem value="GBP">British Pound (£)</MenuItem>
                    <MenuItem value="CAD">Canadian Dollar (C$)</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.timezone", "Timezone")}
                    value={userPreferences.timezone}
                    onChange={(e) =>
                      handlePreferenceChange("timezone", e.target.value)
                    }
                    select
                  >
                    <MenuItem value="America/New_York">Eastern Time</MenuItem>
                    <MenuItem value="America/Chicago">Central Time</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time</MenuItem>
                    <MenuItem value="America/Los_Angeles">
                      Pacific Time
                    </MenuItem>
                    <MenuItem value="Europe/London">London</MenuItem>
                    <MenuItem value="Europe/Paris">Paris</MenuItem>
                    <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Accessibility Settings */}
        <Grid item xs={12} md={getGridCols(12, 6, 6)}>
          <Card>
            <CardHeader
              avatar={<AccessibilityIcon />}
              title={t("settings.accessibility", "Accessibility")}
              subheader={t(
                "settings.accessibilityDesc",
                "Accessibility and comfort settings"
              )}
            />
            <CardContent>
              <Grid container spacing={3} alignItems={"center"}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>
                      {t("settings.fontSize", "Font Size")}
                    </InputLabel>
                    <Select
                      value={
                        userPreferences.accessibility?.fontSize || "medium"
                      }
                      label={t("settings.fontSize", "Font Size")}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "accessibility.fontSize",
                          e.target.value
                        )
                      }
                    >
                      {fontSizeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.accessibility?.highContrast || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "accessibility.highContrast",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t("settings.highContrast", "High Contrast Mode")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.accessibility?.reducedMotion || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "accessibility.reducedMotion",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t("settings.reducedMotion", "Reduce Animations")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Notifications Settings */}
        <Grid item xs={12} md={getGridCols(12, 6, 6)}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title={t("settings.notifications")}
              subheader={t(
                "settings.notificationsDesc",
                "Manage your notification preferences"
              )}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userPreferences.notifications?.email || false}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications.email",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t(
                      "settings.emailNotifications",
                      "Email Notifications"
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userPreferences.notifications?.push || false}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications.push",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t(
                      "settings.pushNotifications",
                      "Push Notifications"
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.notifications?.lowStock || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications.lowStock",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t("settings.lowStockAlerts", "Low Stock Alerts")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.notifications?.orderStatus || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications.orderStatus",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t(
                      "settings.orderStatusUpdates",
                      "Order Status Updates"
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          userPreferences.notifications?.dailyReports || false
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications.dailyReports",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={t("settings.dailyReports", "Daily Reports")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Company Profile Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<StoreIcon />}
              title={t("settings.companyProfile", "Company Profile")}
              subheader={t(
                "settings.companyProfileDesc",
                "Your business information"
              )}
            />
            <CardContent>
              <Grid container spacing={3}>
                {" "}
                <Grid item xs={12} sm={6}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.companyName", "Company Name")}
                    value={localSettings.companyName}
                    onChange={(e) =>
                      handleLocalSettingChange("companyName", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.contactEmail", "Contact Email")}
                    type="email"
                    value={localSettings.contactEmail}
                    onChange={(e) =>
                      handleLocalSettingChange("contactEmail", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.contactPhone", "Contact Phone")}
                    value={localSettings.contactPhone}
                    onChange={(e) =>
                      handleLocalSettingChange("contactPhone", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.address", "Address")}
                    value={localSettings.address}
                    onChange={(e) =>
                      handleLocalSettingChange("address", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.city", "City")}
                    value={localSettings.city}
                    onChange={(e) =>
                      handleLocalSettingChange("city", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.state", "State")}
                    value={localSettings.state}
                    onChange={(e) =>
                      handleLocalSettingChange("state", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ResponsiveTextField
                    fullWidth
                    sx={{ my: 2 }}
                    label={t("settings.zipCode", "ZIP Code")}
                    value={localSettings.zipCode}
                    onChange={(e) =>
                      handleLocalSettingChange("zipCode", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              size={isMobile ? "small" : "medium"}
            >
              {t("common.save")}
            </Button>

            <Button
              variant="outlined"
              onClick={handleResetPreferences}
              size={isMobile ? "small" : "medium"}
              color="error"
            >
              {t("settings.resetPreferences", "Reset Preferences")}
            </Button>
          </Box>
        </Grid>{" "}
      </Grid>
    </Box>
  );
}

export default SettingsPage;
