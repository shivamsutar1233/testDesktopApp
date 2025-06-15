import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
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
  LocalShipping as DeliveryIcon,
  CheckCircle as CompleteIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ResponsiveSelect from "../components/Responsive/ResponsiveSelect";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";

const deliveryStatuses = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const deliveryDrivers = [
  { value: "", label: "All Drivers" },
  { value: "john_doe", label: "John Doe" },
  { value: "jane_smith", label: "Jane Smith" },
  { value: "mike_wilson", label: "Mike Wilson" },
  { value: "sarah_johnson", label: "Sarah Johnson" },
];

function DeliveriesPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [deliveries] = useState([
    {
      id: 1,
      orderId: "ORD-001",
      customerName: "John Smith",
      customerAddress: "123 Main St, City",
      driverName: "John Doe",
      status: "in_progress",
      scheduledTime: "2025-06-15T14:30:00",
      estimatedDelivery: "2025-06-15T15:00:00",
    },
    {
      id: 2,
      orderId: "ORD-002",
      customerName: "Sarah Johnson",
      customerAddress: "456 Oak Ave, City",
      driverName: "Jane Smith",
      status: "delivered",
      scheduledTime: "2025-06-15T13:00:00",
      deliveredTime: "2025-06-15T13:45:00",
    },
  ]);

  const handleSearch = () => {
    // Implement search logic
    console.log("Searching deliveries...");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Implement status filter logic
  };

  const handleDriverChange = (driver) => {
    setSelectedDriver(driver);
    // Implement driver filter logic
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "warning",
      assigned: "info",
      in_progress: "primary",
      delivered: "success",
      failed: "error",
      cancelled: "default",
    };
    return statusColors[status?.toLowerCase()] || "default";
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order #",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
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
            {params.row.customerAddress}
          </Typography>
        </Box>
      ),
    },
    {
      field: "driverName",
      headerName: "Driver",
      width: 140,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value.replace("_", " ").toUpperCase()}
          color={getStatusColor(params.value)}
          variant="outlined"
        />
      ),
    },
    {
      field: "scheduledTime",
      headerName: "Scheduled",
      width: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Typography variant="body2">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        );
      },
    },
    {
      field: "estimatedDelivery",
      headerName: "ETA",
      width: 140,
      renderCell: (params) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        return (
          <Typography variant="body2">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
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
          <Tooltip title="Track Delivery">
            <IconButton size="small" color="primary">
              <DeliveryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === "in_progress" && (
            <Tooltip title="Mark Complete">
              <IconButton size="small" color="success">
                <CompleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
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
          Deliveries Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Schedule Delivery
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
              placeholder="Search deliveries..."
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
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={deliveryStatuses}
              minWidth={150}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <ResponsiveSelect
              label="Driver"
              value={selectedDriver}
              onChange={(e) => handleDriverChange(e.target.value)}
              options={deliveryDrivers}
              minWidth={150}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Tooltip title="Refresh">
                <IconButton onClick={() => console.log("Refresh")}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Deliveries Table */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={deliveries}
          columns={columns}
          pageSize={20}
          pageSizeOptions={[10, 20, 50]}
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

export default DeliveriesPage;
