import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Warning,
  Info,
  LocalOffer,
} from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";

const PRODUCT_CATEGORIES = [
  "Fruits",
  "Vegetables", 
  "Dairy",
  "Meat & Poultry",
  "Bakery",
  "Beverages",
  "Pantry",
  "Frozen",
  "Organic",
  "Other",
];

const UNITS = [
  "kg",
  "lb",
  "piece",
  "bunch",
  "pack",
  "bottle",
  "can",
  "box",
  "bag",
  "liter",
];

function ProductDialog({ open, onClose, product, onSave, mode = "add" }) {
  const { showSuccess, showError } = useNotification() || {};
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    minStockLevel: "",
    maxStockLevel: "",
    unit: "kg",
    sku: "",
    barcode: "",
    supplier: "",
    brand: "",
    weight: "",
    dimensions: "",
    expiryDate: "",
    isActive: true,
    isOnSale: false,
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    tags: [],
    notes: "",
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        stock: product.stock?.toString() || "",
        minStockLevel: product.minStockLevel?.toString() || "",
        maxStockLevel: product.maxStockLevel?.toString() || "",
        unit: product.unit || "kg",
        sku: product.sku || "",
        barcode: product.barcode || "",
        supplier: product.supplier || "",
        brand: product.brand || "",
        weight: product.weight?.toString() || "",
        dimensions: product.dimensions || "",
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        isOnSale: product.isOnSale || false,
        salePrice: product.salePrice?.toString() || "",
        saleStartDate: product.saleStartDate ? new Date(product.saleStartDate).toISOString().split('T')[0] : "",
        saleEndDate: product.saleEndDate ? new Date(product.saleEndDate).toISOString().split('T')[0] : "",
        tags: product.tags || [],
        notes: product.notes || "",
        image: null,
        imagePreview: product.image || null,
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        cost: "",
        stock: "",
        minStockLevel: "5",
        maxStockLevel: "100",
        unit: "kg",
        sku: generateSKU(),
        barcode: "",
        supplier: "",
        brand: "",
        weight: "",
        dimensions: "",
        expiryDate: "",
        isActive: true,
        isOnSale: false,
        salePrice: "",
        saleStartDate: "",
        saleEndDate: "",
        tags: [],
        notes: "",
        image: null,
        imagePreview: null,
      });
    }
    setErrors({});
  }, [product, mode, open]);

  const generateSKU = () => {
    const timestamp = Date.now().toString();
    return `PRD-${timestamp.slice(-6)}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError?.("Please select a valid image file", "Invalid File");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError?.("Image size must be less than 5MB", "File Too Large");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (formData.cost && parseFloat(formData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (formData.minStockLevel && parseInt(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = "Minimum stock level cannot be negative";
    }

    if (formData.maxStockLevel && parseInt(formData.maxStockLevel) < 0) {
      newErrors.maxStockLevel = "Maximum stock level cannot be negative";
    }

    if (formData.minStockLevel && formData.maxStockLevel && 
        parseInt(formData.minStockLevel) > parseInt(formData.maxStockLevel)) {
      newErrors.maxStockLevel = "Maximum stock level must be greater than minimum";
    }

    if (formData.isOnSale && (!formData.salePrice || parseFloat(formData.salePrice) <= 0)) {
      newErrors.salePrice = "Sale price is required when product is on sale";
    }

    if (formData.salePrice && formData.price && 
        parseFloat(formData.salePrice) >= parseFloat(formData.price)) {
      newErrors.salePrice = "Sale price must be less than regular price";
    }

    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    if (formData.saleStartDate && formData.saleEndDate && 
        new Date(formData.saleStartDate) >= new Date(formData.saleEndDate)) {
      newErrors.saleEndDate = "Sale end date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock: parseInt(formData.stock),
        minStockLevel: formData.minStockLevel ? parseInt(formData.minStockLevel) : null,
        maxStockLevel: formData.maxStockLevel ? parseInt(formData.maxStockLevel) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        saleStartDate: formData.saleStartDate ? new Date(formData.saleStartDate).toISOString() : null,
        saleEndDate: formData.saleEndDate ? new Date(formData.saleEndDate).toISOString() : null,
        id: mode === "edit" ? product?.id : undefined,
      };

      await onSave?.(productData);
      showSuccess?.(
        `Product ${mode === "edit" ? "updated" : "created"} successfully`,
        "Success"
      );
      onClose();
    } catch (error) {
      showError?.(
        `Failed to ${mode === "edit" ? "update" : "create"} product`,
        "Error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMarginPercentage = () => {
    if (formData.price && formData.cost) {
      const price = parseFloat(formData.price);
      const cost = parseFloat(formData.cost);
      if (cost > 0) {
        return (((price - cost) / cost) * 100).toFixed(1);
      }
    }
    return 0;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Product Image */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Product Image
                </Typography>
                
                {formData.imagePreview ? (
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                      src={formData.imagePreview}
                      variant="rounded"
                      sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={removeImage}
                      sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <Delete />
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      border: "2px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 48, color: "#ccc" }} />
                  </Box>
                )}
                
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    size="small"
                  >
                    Upload Image
                  </Button>
                </label>
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SKU"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    helperText="Auto-generated if empty"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      label="Category"
                    >
                      {PRODUCT_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Pricing & Costs
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    error={!!errors.cost}
                    helperText={errors.cost}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      label="Unit"
                    >
                      {UNITS.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  {formData.price && formData.cost && (
                    <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                      <Typography variant="body2" color="info.dark">
                        Margin: {getMarginPercentage()}%
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Inventory */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Inventory Management
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Current Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    error={!!errors.stock}
                    helperText={errors.stock}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Min Stock Level"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange("minStockLevel", e.target.value)}
                    error={!!errors.minStockLevel}
                    helperText={errors.minStockLevel || "Alert when stock falls below this level"}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Max Stock Level"
                    type="number"
                    value={formData.maxStockLevel}
                    onChange={(e) => handleInputChange("maxStockLevel", e.target.value)}
                    error={!!errors.maxStockLevel}
                    helperText={errors.maxStockLevel}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Sale Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h6">
                  Sale Information
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isOnSale}
                      onChange={(e) => handleInputChange("isOnSale", e.target.checked)}
                    />
                  }
                  label="On Sale"
                />
                {formData.isOnSale && (
                  <Chip
                    icon={<LocalOffer />}
                    label="On Sale"
                    color="secondary"
                    size="small"
                  />
                )}
              </Box>
              
              {formData.isOnSale && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Sale Price"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange("salePrice", e.target.value)}
                      error={!!errors.salePrice}
                      helperText={errors.salePrice}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Sale Start Date"
                      type="date"
                      value={formData.saleStartDate}
                      onChange={(e) => handleInputChange("saleStartDate", e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Sale End Date"
                      type="date"
                      value={formData.saleEndDate}
                      onChange={(e) => handleInputChange("saleEndDate", e.target.value)}
                      error={!!errors.saleEndDate}
                      helperText={errors.saleEndDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Additional Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                    placeholder="L x W x H (cm)"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange("isActive", e.target.checked)}
                      />
                    }
                    label="Active Product"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Internal notes about this product..."
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Validation Alerts */}
            {formData.stock && formData.minStockLevel && 
             parseInt(formData.stock) <= parseInt(formData.minStockLevel) && (
              <Grid item xs={12}>
                <Alert severity="warning" icon={<Warning />}>
                  Current stock ({formData.stock}) is at or below minimum level ({formData.minStockLevel})
                </Alert>
              </Grid>
            )}
            
            {formData.expiryDate && new Date(formData.expiryDate) <= new Date() && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Product expiry date is in the past
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Product" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDialog;
