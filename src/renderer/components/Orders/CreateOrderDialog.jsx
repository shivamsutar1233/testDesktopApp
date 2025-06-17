import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ResponsiveTextField } from "../Responsive/ResponsiveComponents";
import { useNotification } from "../../context/NotificationContext";

const MOCK_CUSTOMERS = [
  { id: "cust_001", name: "John Smith", email: "john.smith@email.com" },
  { id: "cust_002", name: "Sarah Johnson", email: "sarah.j@email.com" },
  { id: "cust_003", name: "Mike Wilson", email: "mike.w@email.com" },
];

const MOCK_PRODUCTS = [
  { id: "prod_001", name: "Organic Bananas", price: 3.99 },
  { id: "prod_002", name: "Whole Milk", price: 4.5 },
  { id: "prod_003", name: "Sourdough Bread", price: 5.99 },
  { id: "prod_004", name: "Chicken Breast", price: 12.99 },
  { id: "prod_005", name: "Mixed Vegetables", price: 8.5 },
];

function CreateOrderDialog({ open, onClose, onSubmit }) {
  const { showSuccess, showError } = useNotification();

  const [orderData, setOrderData] = useState({
    customerId: null,
    items: [],
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    notes: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateForm = () => {
    const newErrors = {};

    if (!orderData.customerId) {
      newErrors.customerId = "Please select a customer";
    }

    if (orderData.items.length === 0) {
      newErrors.items = "Please add at least one item";
    }

    if (!orderData.deliveryAddress.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!orderData.deliveryAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!orderData.deliveryAddress.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!orderData.deliveryAddress.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (event, newValue) => {
    setOrderData((prev) => ({
      ...prev,
      customerId: newValue?.id || null,
    }));
    if (errors.customerId) {
      setErrors((prev) => ({ ...prev, customerId: null }));
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const existingItemIndex = orderData.items.findIndex(
      (item) => item.productId === selectedProduct.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity * selectedProduct.price;

      setOrderData((prev) => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      const newItem = {
        id: `item_${Date.now()}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: selectedProduct.price,
        total: quantity * selectedProduct.price,
      };

      setOrderData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (itemId) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };
  const handleAddressChange = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value,
      },
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const calculateTotal = () => {
    return orderData.items.reduce((sum, item) => sum + item.total, 0);
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      showError("Please fix the errors in the form", "Validation Error");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        ...orderData,
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        status: "pending",
      };

      await onSubmit(orderPayload);
      showSuccess("Order created successfully!", "Success");
      handleClose();
    } catch (error) {
      console.error("Error creating order:", error);
      showError("Failed to create order. Please try again.", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    setOrderData({
      customerId: null,
      items: [],
      deliveryAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
      notes: "",
    });
    setSelectedProduct(null);
    setQuantity(1);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          minHeight: "70vh",
          height: "90",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" component="div">
          Create New Order
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Grid container spacing={3} sx={{ height: "100%" }}>
          {" "}
          {/* Customer Selection */}
          <Grid size={6}>
            <Grid size={12}>
              <Autocomplete
                options={MOCK_CUSTOMERS}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    required
                    error={!!errors.customerId}
                    helperText={errors.customerId}
                  />
                )}
              />
            </Grid>
            {/* Add Items Section */}
            <Grid item xs={12} size={12}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Autocomplete
                  options={MOCK_PRODUCTS}
                  getOptionLabel={(option) =>
                    `${option.name} - $${option.price}`
                  }
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  sx={{ flexGrow: 1, minWidth: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product" />
                  )}
                />
                <ResponsiveTextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  sx={{ width: 120 }}
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  size="large"
                />
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  disabled={!selectedProduct}
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Add Item{" "}
                </Button>
              </Box>{" "}
              {/* Items Table */}
              {orderData.items.length > 0 && (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    mt: 2,
                    overflowX: "auto",
                  }}
                >
                  <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Total
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderData.items.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ maxWidth: 200 }}>
                            {item.productName}
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ${item.total.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "grey.50" }}>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            ${calculateTotal().toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>{" "}
                </TableContainer>
              )}
            </Grid>
          </Grid>
          {/* Delivery Address */}
          <Grid container spacing={3} size={6}>
            <Grid item xs={12} size={12}>
              <Typography variant="h6" gutterBottom>
                Delivery Address
              </Typography>
            </Grid>{" "}
            <Grid item xs={12} size={12}>
              <ResponsiveTextField
                label="Street Address"
                value={orderData.deliveryAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                fullWidth
                required
                error={!!errors.street}
                helperText={errors.street}
                size="large"
              />
            </Grid>
            <Grid item xs={12} size={12}>
              <ResponsiveTextField
                label="City"
                value={orderData.deliveryAddress.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                fullWidth
                required
                error={!!errors.city}
                helperText={errors.city}
                size="large"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <ResponsiveTextField
                label="State"
                value={orderData.deliveryAddress.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                fullWidth
                required
                error={!!errors.state}
                helperText={errors.state}
                size="large"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <ResponsiveTextField
                label="ZIP Code"
                value={orderData.deliveryAddress.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                fullWidth
                required
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                size="large"
              />
            </Grid>
            {/* Notes */}
            <Grid item xs={12} size={12}>
              <ResponsiveTextField
                label="Order Notes"
                value={orderData.notes}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, notes: e.target.value }))
                }
                fullWidth
                multiline
                rows={3}
                placeholder="Special delivery instructions, customer preferences, etc."
              />
            </Grid>{" "}
          </Grid>
        </Grid>
      </DialogContent>{" "}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? "Creating..." : "Create Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateOrderDialog;
