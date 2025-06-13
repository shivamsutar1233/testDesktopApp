import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Alert,
} from '@mui/material'
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Store as StoreIcon,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

function SettingsPage() {
  const { user } = useSelector((state) => state.auth)
  
  const [settings, setSettings] = useState({
    // User Profile
    companyName: 'Grocery Manager Inc.',
    contactEmail: 'admin@grocerymanager.com',
    contactPhone: '+1 555-0123',
    address: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    orderStatusUpdates: true,
    dailyReports: false,
    
    // System
    theme: 'light',
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Business Rules
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    deliveryRadius: 25,
    defaultDeliveryTime: 60,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend/localStorage
    console.log('Settings saved:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ]

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
  ]

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
  ]

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<StoreIcon />}
              title="Company Information"
              subheader="Manage your business details"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={settings.companyName}
                    onChange={handleChange('companyName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange('contactEmail')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={settings.contactPhone}
                    onChange={handleChange('contactPhone')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={settings.address}
                    onChange={handleChange('address')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={settings.city}
                    onChange={handleChange('city')}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="State"
                    value={settings.state}
                    onChange={handleChange('state')}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={settings.zipCode}
                    onChange={handleChange('zipCode')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title="Notification Settings"
              subheader="Configure your alert preferences"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleChange('pushNotifications')}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.lowStockAlerts}
                      onChange={handleChange('lowStockAlerts')}
                    />
                  }
                  label="Low Stock Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.orderStatusUpdates}
                      onChange={handleChange('orderStatusUpdates')}
                    />
                  }
                  label="Order Status Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dailyReports}
                      onChange={handleChange('dailyReports')}
                    />
                  }
                  label="Daily Reports"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<ThemeIcon />}
              title="System Preferences"
              subheader="Customize your app experience"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Theme"
                    value={settings.theme}
                    onChange={handleChange('theme')}
                  >
                    {themes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Language"
                    value={settings.language}
                    onChange={handleChange('language')}
                  >
                    {languages.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Currency"
                    value={settings.currency}
                    onChange={handleChange('currency')}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Timezone"
                    value={settings.timezone}
                    onChange={handleChange('timezone')}
                  >
                    {timezones.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Rules */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<SecurityIcon />}
              title="Business Rules"
              subheader="Configure operational parameters"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Low Stock Threshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={handleChange('lowStockThreshold')}
                    helperText="Alert when stock falls below this number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Delivery Radius (miles)"
                    type="number"
                    value={settings.deliveryRadius}
                    onChange={handleChange('deliveryRadius')}
                    helperText="Maximum delivery distance"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Default Delivery Time (minutes)"
                    type="number"
                    value={settings.defaultDeliveryTime}
                    onChange={handleChange('defaultDeliveryTime')}
                    helperText="Estimated delivery time for new orders"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoReorderEnabled}
                        onChange={handleChange('autoReorderEnabled')}
                      />
                    }
                    label="Enable Auto-Reorder"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsPage
