import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  setFilters,
  createOrder,
} from "../store/slices/ordersSlice";
import CreateOrderDialog from "../components/Orders/CreateOrderDialog";
import ResponsiveSelect from "../components/Responsive/ResponsiveSelect";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";

const orderStatuses = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready for Delivery" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading, totalOrders, currentPage, totalPages, filters } =
    useSelector((state) => state.orders);

  const [searchText, setSearchText] = useState(filters.search || "");
  const [paginationModel, setPaginationModel] = useState({
    page: currentPage - 1,
    pageSize: 20,
  });
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchOrders({
        page: currentPage,
        limit: 20,
        status: filters.status,
        search: filters.search,
      })
    );
  }, [dispatch, currentPage, filters]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchText }));
    dispatch(
      fetchOrders({
        page: 1,
        limit: 20,
        status: filters.status,
        search: searchText,
      })
    );
  };

  const handleStatusChange = (status) => {
    dispatch(setFilters({ status }));
    dispatch(
      fetchOrders({
        page: 1,
        limit: 20,
        status,
        search: filters.search,
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      fetchOrders({
        page: currentPage,
        limit: 20,
        status: filters.status,
        search: filters.search,
      })
    );
  };

  const handleRowClick = (params) => {
    navigate(`/orders/${params.id}`);
  };

  const handleCreateOrder = async (orderData) => {
    try {
      await dispatch(createOrder(orderData)).unwrap();
      // Refresh the orders list
      dispatch(
        fetchOrders({
          page: currentPage,
          limit: 20,
          status: filters.status,
          search: filters.search,
        })
      );
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "warning",
      confirmed: "info",
      preparing: "info",
      ready: "primary",
      out_for_delivery: "secondary",
      delivered: "success",
      cancelled: "error",
    };
    return statusColors[status?.toLowerCase()] || "default";
  };

  const columns = [
    {
      field: "id",
      headerName: "Order #",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "customerName",
      headerName: "Customer",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.customerEmail}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          ${params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value?.replace("_", " ").toUpperCase()}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "deliveryAddress",
      headerName: "Delivery Address",
      width: 200,
      renderCell: (params) => {
        const address = params.value;
        return (
          <Typography variant="body2" noWrap>
            {address
              ? `${address.street}, ${address.city}, ${address.state}`
              : "No address"}
          </Typography>
        );
      },
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Orders Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOrderOpen(true)}
        >
          New Order
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {" "}
          <Grid item xs={12} md={4}>
            <ResponsiveTextField
              fullWidth
              size="small"
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <ResponsiveSelect
              label="Status"
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={orderStatuses}
              minWidth={150}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalOrders}
          loading={isLoading}
          pageSizeOptions={[10, 20, 50]}
          paginationMode="server"
          onRowClick={handleRowClick}
          sx={{
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Create Order Dialog */}
      <CreateOrderDialog
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </Box>
  );
}

export default OrdersPage;
