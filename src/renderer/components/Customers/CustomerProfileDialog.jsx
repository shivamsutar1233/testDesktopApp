import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Save,
  Cancel,
} from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";

const CUSTOMER_TIERS = [
  { value: "bronze", label: "Bronze", color: "#CD7F32" },
  { value: "silver", label: "Silver", color: "#C0C0C0" },
  { value: "gold", label: "Gold", color: "#FFD700" },
  { value: "platinum", label: "Platinum", color: "#E5E4E2" },
];

const CUSTOMER_STATUSES = [
  { value: "active", label: "Active", color: "success" },
  { value: "inactive", label: "Inactive", color: "default" },
  { value: "suspended", label: "Suspended", color: "error" },
];

function CustomerProfileDialog({
  open,
  onClose,
  customer = null,
  onSave,
  mode = "create", // 'create', 'edit', 'view'
}) {
  const { showSuccess, showError } = useNotification();
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
    },
    tier: "bronze",
    status: "active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer && mode !== "create") {
      setCustomerData({
        ...customer,
        address: customer.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        preferences: customer.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
        },
      });
    }
  }, [customer, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!customerData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!customerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!customerData.address.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!customerData.address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!customerData.address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!customerData.address.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the errors in the form", "Validation Error");
      return;
    }

    setLoading(true);
    try {
      await onSave(customerData);
      showSuccess(
        `Customer ${mode === "create" ? "created" : "updated"} successfully!`,
        "Success"
      );
      handleClose();
    } catch (error) {
      showError(
        `Failed to ${mode === "create" ? "create" : "update"} customer`,
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCustomerData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
      },
      tier: "bronze",
      status: "active",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleAddressChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handlePreferenceChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const isReadOnly = mode === "view";
  const currentTier = CUSTOMER_TIERS.find(
    (tier) => tier.value === customerData.tier
  );
  const currentStatus = CUSTOMER_STATUSES.find(
    (status) => status.value === customerData.status
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6">
              {mode === "create" && "Create New Customer"}
              {mode === "edit" && "Edit Customer"}
              {mode === "view" && "Customer Profile"}
            </Typography>
            {customer && (
              <Box display="flex" gap={1} mt={1}>
                <Chip
                  label={currentTier?.label}
                  size="small"
                  sx={{ bgcolor: currentTier?.color, color: "white" }}
                />
                <Chip
                  label={currentStatus?.label}
                  color={currentStatus?.color}
                  size="small"
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={customerData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={customerData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isReadOnly}
              required
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={customerData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isReadOnly}
              required
              InputProps={{
                startAdornment: (
                  <Phone sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom color="primary">
              <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              value={customerData.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              error={!!errors.street}
              helperText={errors.street}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={customerData.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="State"
              value={customerData.address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              error={!!errors.state}
              helperText={errors.state}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={customerData.address.zipCode}
              onChange={(e) => handleAddressChange("zipCode", e.target.value)}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              disabled={isReadOnly}
              required
            />
          </Grid>

          {/* Customer Settings */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom color="primary">
              Customer Settings
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Customer Tier</InputLabel>
              <Select
                value={customerData.tier}
                onChange={(e) => handleInputChange("tier", e.target.value)}
                label="Customer Tier"
              >
                {CUSTOMER_TIERS.map((tier) => (
                  <MenuItem key={tier.value} value={tier.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: tier.color,
                        }}
                      />
                      {tier.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Status</InputLabel>
              <Select
                value={customerData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                label="Status"
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Preferences */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Communication Preferences
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={customerData.preferences.emailNotifications}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                    disabled={isReadOnly}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={customerData.preferences.smsNotifications}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "smsNotifications",
                        e.target.checked
                      )
                    }
                    disabled={isReadOnly}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={customerData.preferences.marketingEmails}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "marketingEmails",
                        e.target.checked
                      )
                    }
                    disabled={isReadOnly}
                  />
                }
                label="Marketing Emails"
              />
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={customerData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isReadOnly}
              placeholder="Any additional notes about this customer..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} startIcon={<Cancel />}>
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Customer"
              : "Save Changes"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CustomerProfileDialog;
