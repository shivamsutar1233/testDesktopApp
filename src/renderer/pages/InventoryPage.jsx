import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilters } from "../store/slices/inventorySlice";
import ResponsiveSelect from "../components/Responsive/ResponsiveSelect";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";

const categories = [
  { value: "", label: "All Categories" },
  { value: "Fruits", label: "Fruits" },
  { value: "Dairy", label: "Dairy" },
  { value: "Bakery", label: "Bakery" },
  { value: "Meat", label: "Meat" },
  { value: "Frozen", label: "Frozen" },
  { value: "Beverages", label: "Beverages" },
];

function InventoryPage() {
  const dispatch = useDispatch();
  const {
    products,
    isLoading,
    totalProducts,
    currentPage,
    totalPages,
    filters,
  } = useSelector((state) => state.inventory);

  const [searchText, setSearchText] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || ""
  );
  const [showLowStock, setShowLowStock] = useState(filters.lowStock || false);
  const [paginationModel, setPaginationModel] = useState({
    page: currentPage - 1,
    pageSize: 20,
  });

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 20,
        category: filters.category,
        search: filters.search,
        lowStock: filters.lowStock,
      })
    );
  }, [dispatch, currentPage, filters]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchText }));
    dispatch(
      fetchProducts({
        page: 1,
        limit: 20,
        category: selectedCategory,
        search: searchText,
        lowStock: showLowStock,
      })
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(setFilters({ category }));
    dispatch(
      fetchProducts({
        page: 1,
        limit: 20,
        category,
        search: filters.search,
        lowStock: showLowStock,
      })
    );
  };

  const handleLowStockToggle = () => {
    const newShowLowStock = !showLowStock;
    setShowLowStock(newShowLowStock);
    dispatch(setFilters({ lowStock: newShowLowStock }));
    dispatch(
      fetchProducts({
        page: 1,
        limit: 20,
        category: selectedCategory,
        search: filters.search,
        lowStock: newShowLowStock,
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 20,
        category: filters.category,
        search: filters.search,
        lowStock: filters.lowStock,
      })
    );
  };

  const getStockColor = (stock, minStock) => {
    if (stock === 0) return "error";
    if (stock <= minStock) return "warning";
    return "success";
  };

  const getStockLabel = (stock, minStock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.name}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Product Name",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 120,
      renderCell: (params) => (
        <Chip size="small" label={params.value} variant="outlined" />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 120,
      renderCell: (params) => {
        const stock = params.value;
        const minStock = params.row.minStock;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {stock}
            </Typography>
            <Chip
              size="small"
              label={getStockLabel(stock, minStock)}
              color={getStockColor(stock, minStock)}
              variant="outlined"
            />
            {stock <= minStock && (
              <WarningIcon color="warning" fontSize="small" />
            )}
          </Box>
        );
      },
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 150,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.value);
        const isExpiringSoon =
          date.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color={isExpiringSoon ? "error.main" : "text.primary"}
            >
              {date.toLocaleDateString()}
            </Typography>
            {isExpiringSoon && <WarningIcon color="error" fontSize="small" />}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Product">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
          Inventory Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {" "}
          <Grid item xs={12} md={3}>
            <ResponsiveTextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <ResponsiveSelect
              label="Category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={categories}
              minWidth={160}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant={showLowStock ? "contained" : "outlined"}
              color="warning"
              onClick={handleLowStockToggle}
              startIcon={<WarningIcon />}
            >
              Low Stock
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Products: {totalProducts}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalProducts}
          loading={isLoading}
          pageSizeOptions={[10, 20, 50]}
          paginationMode="server"
          sx={{
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}

export default InventoryPage;
