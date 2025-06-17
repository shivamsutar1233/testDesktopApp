import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Badge,
  CardMedia,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  Warning,
  CheckCircle,
  Error,
  Inventory,
  LocalOffer,
  Visibility,
  Add,
  Remove,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import ProductDialog from "./ProductDialog";

const STOCK_STATUS = {
  in_stock: { label: "In Stock", color: "success", icon: <CheckCircle /> },
  low_stock: { label: "Low Stock", color: "warning", icon: <Warning /> },
  out_of_stock: { label: "Out of Stock", color: "error", icon: <Error /> },
};

const PRODUCT_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat & Poultry",
  "Bakery",
  "Beverages",
  "Pantry",
  "Frozen",
  "Other",
];

function getStockStatus(stock, minStockLevel) {
  if (stock === 0) return "out_of_stock";
  if (stock <= minStockLevel) return "low_stock";
  return "in_stock";
}

function ProductCard({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
  onViewDetails,
}) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification() || {};
  const [stockUpdateOpen, setStockUpdateOpen] = useState(false);
  const [newStockQuantity, setNewStockQuantity] = useState(product?.stock || 0);

  const stockStatus = getStockStatus(
    product?.stock || 0,
    product?.minStockLevel || 0
  );
  const statusInfo = STOCK_STATUS[stockStatus] || STOCK_STATUS.out_of_stock;

  const handleStockUpdate = async () => {
    if (!product?.id) {
      showError?.("Product ID is missing", "Error");
      return;
    }

    try {
      await onUpdateStock?.(product.id, newStockQuantity);
      showSuccess?.(`Stock updated for ${product.name}`, "Stock Updated");
      setStockUpdateOpen(false);
    } catch (error) {
      showError?.("Failed to update stock", "Error");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate(`/inventory/products/${product?.id}`);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      {/* Stock Status Badge */}
      <Box position="absolute" top={8} right={8} zIndex={1}>
        <Tooltip title={`Stock: ${product.stock || 0} units`}>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
          />
        </Tooltip>
      </Box>

      {/* Product Image */}
      {product.image ? (
        <CardMedia
          component="img"
          height="160"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: "cover", cursor: "pointer" }}
          onClick={handleViewDetails}
        />
      ) : (
        <Box
          sx={{
            height: 160,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleViewDetails}
        >
          <Inventory sx={{ fontSize: 48, color: "grey.400" }} />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {product.name}
        </Typography>

        {product.sku && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            SKU: {product.sku}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Category: {product.category || "Uncategorized"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {product.isOnSale
              ? formatPrice(product.salePrice)
              : formatPrice(product.price)}
          </Typography>
          {product.isOnSale && (
            <>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                {formatPrice(product.price)}
              </Typography>
              <Chip
                icon={<LocalOffer />}
                label="Sale"
                color="secondary"
                size="small"
              />
            </>
          )}
        </Box>

        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
            }}
          >
            {product.description}
          </Typography>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Inventory fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Stock: {product.stock || 0}
            </Typography>
          </Box>

          {product.brand && (
            <Typography variant="caption" color="text.secondary">
              {product.brand}
            </Typography>
          )}
        </Box>

        {stockStatus === "low_stock" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Low stock! Only {product.stock} left.
            </Typography>
          </Alert>
        )}

        {stockStatus === "out_of_stock" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">Out of stock!</Typography>
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={handleViewDetails}
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => onEdit?.(product)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete?.(product.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Update Stock">
            <IconButton
              size="small"
              onClick={() => setStockUpdateOpen(!stockUpdateOpen)}
              color="info"
            >
              <Inventory />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add to Cart">
            <IconButton
              size="small"
              color="success"
              disabled={stockStatus === "out_of_stock"}
            >
              <ShoppingCart />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      {/* Quick Stock Update */}
      {stockUpdateOpen && (
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="New Stock Quantity"
            value={newStockQuantity}
            onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setNewStockQuantity(Math.max(0, newStockQuantity - 1))
                    }
                  >
                    <Remove />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setNewStockQuantity(newStockQuantity + 1)}
                  >
                    <Add />
                  </IconButton>
                  <Button
                    size="small"
                    onClick={handleStockUpdate}
                    sx={{ ml: 1 }}
                  >
                    Update
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Card>
  );
}

function ProductGrid({
  products = [],
  onEdit,
  onDelete,
  onUpdateStock,
  onViewDetails,
  searchTerm = "",
  onSearchChange,
  categoryFilter = "",
  onCategoryFilterChange,
  stockFilter = "",
  onStockFilterChange,
}) {
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product?.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !categoryFilter || product?.category === categoryFilter;

    const matchesStock =
      !stockFilter ||
      getStockStatus(product?.stock || 0, product?.minStockLevel || 0) ===
        stockFilter;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const stockCounts = products.reduce((acc, product) => {
    const status = getStockStatus(
      product?.stock || 0,
      product?.minStockLevel || 0
    );
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  return (
    <Box>
      {/* Filters and Search */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange?.(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {PRODUCT_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockFilter}
                onChange={(e) => onStockFilterChange?.(e.target.value)}
                label="Stock Status"
              >
                <MenuItem value="">All Stock Levels</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="low_stock">Low Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box display="flex" gap={1}>
              <Badge badgeContent={stockCounts.low_stock || 0} color="warning">
                <Chip
                  label="Low Stock"
                  color={stockFilter === "low_stock" ? "warning" : "default"}
                  variant={stockFilter === "low_stock" ? "filled" : "outlined"}
                  onClick={() =>
                    onStockFilterChange?.(
                      stockFilter === "low_stock" ? "" : "low_stock"
                    )
                  }
                  clickable
                />
              </Badge>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product?.id}>
              <ProductCard
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStock={onUpdateStock}
                onViewDetails={onViewDetails || handleViewProductDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
            >
              <Inventory sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || categoryFilter || stockFilter
                  ? "Try adjusting your filters to see more products."
                  : "Start by adding your first product."}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Product Details Dialog */}
      <ProductDialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        product={selectedProduct}
        onSave={() => {}} // This would be handled by parent component
        mode="view"
      />
    </Box>
  );
}

export default ProductGrid;
