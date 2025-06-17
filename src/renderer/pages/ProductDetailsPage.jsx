import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Edit,
  Warning,
  CheckCircle,
  LocalOffer,
  Inventory,
  TrendingUp,
  History,
  ShoppingCart,
  LocalShipping,
  Star,
  StarBorder,
  Refresh,
  Print,
  Share,
  Add,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import ProductDialog from "../components/Inventory/ProductDialog";

// Mock data for demonstration
const mockProduct = {
  id: 1,
  name: "Organic Apples",
  description:
    "Fresh organic red apples from local farms. Sweet, crispy, and perfect for snacking or cooking.",
  category: "Fruits",
  price: 4.99,
  cost: 2.5,
  stock: 45,
  minStockLevel: 10,
  maxStockLevel: 100,
  unit: "kg",
  sku: "ORG-APP-001",
  barcode: "1234567890123",
  supplier: "Green Valley Farms",
  brand: "Organic Plus",
  weight: 0.2,
  dimensions: "8x8x8 cm",
  expiryDate: "2025-07-15",
  isActive: true,
  isOnSale: true,
  salePrice: 3.99,
  saleStartDate: "2025-06-01",
  saleEndDate: "2025-06-30",
  tags: ["organic", "local", "fresh"],
  notes: "High demand product. Monitor stock levels closely.",
  image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
  rating: 4.5,
  reviewCount: 28,
  totalSold: 245,
  revenue: 1225.55,
  lastRestocked: "2025-06-10",
  createdAt: "2025-01-15",
  updatedAt: "2025-06-15",
};

const mockStockHistory = [
  {
    date: "2025-06-15",
    type: "sale",
    quantity: -5,
    balance: 45,
    note: "Online order #1234",
  },
  {
    date: "2025-06-14",
    type: "sale",
    quantity: -3,
    balance: 50,
    note: "Store purchase",
  },
  {
    date: "2025-06-10",
    type: "restock",
    quantity: +20,
    balance: 53,
    note: "Weekly delivery from supplier",
  },
  {
    date: "2025-06-08",
    type: "sale",
    quantity: -7,
    balance: 33,
    note: "Bulk order",
  },
  {
    date: "2025-06-05",
    type: "adjustment",
    quantity: -2,
    balance: 40,
    note: "Damaged items removed",
  },
];

const mockSalesData = [
  { month: "Jan", quantity: 45, revenue: 224.55 },
  { month: "Feb", quantity: 52, revenue: 259.48 },
  { month: "Mar", quantity: 38, revenue: 189.62 },
  { month: "Apr", quantity: 41, revenue: 204.59 },
  { month: "May", quantity: 69, revenue: 344.31 },
  { month: "Jun", quantity: 35, revenue: 174.65 },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification() || {};

  const [product, setProduct] = useState(mockProduct);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProduct = async (productData) => {
    try {
      setLoading(true);
      // API call would go here
      setProduct({ ...product, ...productData });
      showSuccess?.("Product updated successfully", "Success");
      setEditDialogOpen(false);
    } catch (error) {
      showError?.("Failed to update product", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async () => {
    if (!stockAdjustment.quantity || !stockAdjustment.note) {
      showError?.("Please enter both quantity and note", "Error");
      return;
    }

    try {
      const newStock = product.stock + parseInt(stockAdjustment.quantity);
      setProduct({ ...product, stock: newStock });
      showSuccess?.("Stock adjusted successfully", "Success");
      setStockDialogOpen(false);
      setStockAdjustment({ quantity: "", note: "" });
    } catch (error) {
      showError?.("Failed to adjust stock", "Error");
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0)
      return { status: "out_of_stock", color: "error", label: "Out of Stock" };
    if (product.stock <= product.minStockLevel)
      return { status: "low_stock", color: "warning", label: "Low Stock" };
    return { status: "in_stock", color: "success", label: "In Stock" };
  };

  const stockStatus = getStockStatus();
  const marginPercentage = product.cost
    ? (((product.price - product.cost) / product.cost) * 100).toFixed(1)
    : 0;
  const stockPercentage = (
    (product.stock / product.maxStockLevel) *
    100
  ).toFixed(1);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Product Details
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Print />}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<Share />}>
            Share
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Product
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Product Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {product.name}
                </Typography>
                <Chip
                  icon={
                    stockStatus.status === "in_stock" ? (
                      <CheckCircle />
                    ) : (
                      <Warning />
                    )
                  }
                  label={stockStatus.label}
                  color={stockStatus.color}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${product.isOnSale ? product.salePrice : product.price}
                </Typography>
                {product.isOnSale && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      ${product.price}
                    </Typography>
                    <Chip
                      icon={<LocalOffer />}
                      label="On Sale"
                      color="secondary"
                      size="small"
                    />
                  </>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justify: "space-between", mb: 1 }}>
                <Typography variant="body2">SKU:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {product.sku}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justify: "space-between", mb: 1 }}>
                <Typography variant="body2">Category:</Typography>
                <Chip
                  label={product.category}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: "flex", justify: "space-between", mb: 1 }}>
                <Typography variant="body2">Brand:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {product.brand}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justify: "space-between", mb: 2 }}>
                <Typography variant="body2">Supplier:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {product.supplier}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Inventory />}
                onClick={() => setStockDialogOpen(true)}
                sx={{ mb: 1 }}
              >
                Adjust Stock
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
              >
                Add to Order
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Details and Analytics */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Stock Management" />
                <Tab label="Sales Analytics" />
                <Tab label="History" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Key Metrics */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="primary"
                          fontWeight="bold"
                        >
                          {product.stock}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current Stock
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="success.main"
                          fontWeight="bold"
                        >
                          {product.totalSold}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Sold
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="info.main"
                          fontWeight="bold"
                        >
                          ${product.revenue}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="warning.main"
                          fontWeight="bold"
                        >
                          {marginPercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Profit Margin
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Product Information
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Cost Price</TableCell>
                          <TableCell>${product.cost}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Selling Price</TableCell>
                          <TableCell>${product.price}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Unit</TableCell>
                          <TableCell>{product.unit}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Weight</TableCell>
                          <TableCell>{product.weight} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dimensions</TableCell>
                          <TableCell>{product.dimensions}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Barcode</TableCell>
                          <TableCell>{product.barcode}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Expiry Date</TableCell>
                          <TableCell>
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Ratings & Reviews */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Customer Rating
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">
                      {product.rating}
                    </Typography>
                    <Box>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IconButton key={star} size="small" disabled>
                          {star <= product.rating ? (
                            <Star color="warning" />
                          ) : (
                            <StarBorder />
                          )}
                        </IconButton>
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviewCount} reviews)
                    </Typography>
                  </Box>

                  {product.notes && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Internal Notes
                      </Typography>
                      <Alert severity="info" sx={{ mt: 1 }}>
                        {product.notes}
                      </Alert>
                    </>
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Stock Management Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Stock Levels
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Current Stock</Typography>
                      <Typography variant="body2">
                        {product.stock} / {product.maxStockLevel}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(stockPercentage, 100)}
                      color={stockStatus.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Min: {product.minStockLevel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max: {product.maxStockLevel}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert severity={stockStatus.color} sx={{ mb: 2 }}>
                    {stockStatus.status === "low_stock" &&
                      `Stock is running low! Only ${product.stock} units remaining.`}
                    {stockStatus.status === "out_of_stock" &&
                      "Product is out of stock! Restock immediately."}
                    {stockStatus.status === "in_stock" &&
                      "Stock levels are healthy."}
                  </Alert>

                  <Typography variant="body2" color="text.secondary">
                    Last restocked:{" "}
                    {new Date(product.lastRestocked).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setStockDialogOpen(true)}
                    >
                      Adjust Stock Level
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<LocalShipping />}
                    >
                      Request Restock
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<History />}
                    >
                      View Full History
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Recent Stock Movements
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Balance</TableCell>
                          <TableCell>Note</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockStockHistory.slice(0, 5).map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(entry.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={entry.type}
                                color={
                                  entry.type === "restock"
                                    ? "success"
                                    : entry.type === "sale"
                                    ? "primary"
                                    : "warning"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={
                                  entry.quantity > 0
                                    ? "success.main"
                                    : "error.main"
                                }
                                fontWeight="bold"
                              >
                                {entry.quantity > 0 ? "+" : ""}
                                {entry.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{entry.balance}</TableCell>
                            <TableCell>{entry.note}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Sales Analytics Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Sales Performance
                  </Typography>
                  <Grid container spacing={2}>
                    {mockSalesData.map((data, index) => (
                      <Grid item xs={6} md={2} key={data.month}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="h6" fontWeight="bold">
                            {data.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {data.month}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            ${data.revenue}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Sales Trends
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px dashed #ccc",
                      borderRadius: 1,
                    }}
                  >
                    <TrendingUp
                      sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                    />
                    <Typography variant="body1">
                      Sales chart visualization would go here
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Integration with charting library needed
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Average Monthly Sales</TableCell>
                          <TableCell align="right">47 units</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Best Month</TableCell>
                          <TableCell align="right">May (69 units)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Average Revenue/Month</TableCell>
                          <TableCell align="right">$232</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Profit Margin</TableCell>
                          <TableCell align="right">
                            {marginPercentage}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Customer Rating</TableCell>
                          <TableCell align="right">
                            {product.rating}/5 ⭐
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Product History
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Details</TableCell>
                          <TableCell>User</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {new Date(product.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip label="Updated" color="info" size="small" />
                          </TableCell>
                          <TableCell>
                            Price changed to ${product.price}
                          </TableCell>
                          <TableCell>Admin User</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            {new Date(
                              product.lastRestocked
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Restocked"
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>Added 20 units from supplier</TableCell>
                          <TableCell>System</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Created"
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>Product added to inventory</TableCell>
                          <TableCell>Admin User</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Product Dialog */}
      <ProductDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        product={product}
        onSave={handleEditProduct}
        mode="edit"
      />

      {/* Stock Adjustment Dialog */}
      <Dialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adjust Stock Level</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Quantity Adjustment"
              type="number"
              value={stockAdjustment.quantity}
              onChange={(e) =>
                setStockAdjustment({
                  ...stockAdjustment,
                  quantity: e.target.value,
                })
              }
              helperText="Use positive numbers to add stock, negative to remove"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Reason/Note"
              multiline
              rows={3}
              value={stockAdjustment.note}
              onChange={(e) =>
                setStockAdjustment({ ...stockAdjustment, note: e.target.value })
              }
              placeholder="Reason for stock adjustment..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStockAdjustment} variant="contained">
            Adjust Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductDetailsPage;
