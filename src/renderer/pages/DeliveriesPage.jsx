import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CheckCircle as CompleteIcon,
  Visibility as ViewIcon,
  MyLocation as TrackIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ResponsiveSelect from "../components/Responsive/ResponsiveSelect";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";
import DeliveryTracker from "../components/Deliveries/DeliveryTracker";
import { useNotification } from "../context/NotificationContext";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveries] = useState([
    {
      id: 1,
      orderId: "ORD-001",
      customerName: "John Smith",
      customerAddress: "123 Main St, City",
      customerId: 1,
      driverName: "John Doe",
      driverId: "driver_001",
      driverPhone: "+1 (555) 123-4567",
      status: "in_progress",
      scheduledTime: "2025-06-15T14:30:00",
      estimatedDelivery: "2025-06-15T15:00:00",
      estimatedDeliveryTime: "2025-06-15T15:00:00",
      assignedAt: "2025-06-15T14:00:00",
      lastUpdate: "2025-06-15T14:45:00",
      priority: "Normal",
      trackingData: {
        currentLocation: { lat: 40.7128, lng: -74.006 },
        route: [],
      },
    },
    {
      id: 2,
      orderId: "ORD-002",
      customerName: "Sarah Johnson",
      customerAddress: "456 Oak Ave, City",
      customerId: 2,
      driverName: "Jane Smith",
      driverId: "driver_002",
      driverPhone: "+1 (555) 987-6543",
      status: "delivered",
      scheduledTime: "2025-06-15T13:00:00",
      deliveredTime: "2025-06-15T13:45:00",
      estimatedDeliveryTime: "2025-06-15T13:30:00",
      assignedAt: "2025-06-15T12:30:00",
      lastUpdate: "2025-06-15T13:45:00",
      priority: "High",
      trackingData: {
        currentLocation: { lat: 40.7589, lng: -73.9851 },
        route: [],
      },
    },
  ]);

  // Handle highlighting delivery when navigated from OrderDetailsPage
  useEffect(() => {
    if (location.state?.highlightDelivery) {
      const delivery = deliveries.find(
        (d) => d.id === location.state.highlightDelivery
      );
      if (delivery) {
        setTimeout(() => {
          handleTrackDelivery(delivery);
        }, 500);
      }
    }
  }, [location.state]);

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

  const handleTrackDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setTrackingDialogOpen(true);
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId.replace("ORD-", "")}`);
  };

  const handleStatusUpdate = async (deliveryId, newStatus, note) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess(`Delivery status updated to ${newStatus}`, "Status Updated");
      // Update local state or refetch data
    } catch (error) {
      showError("Failed to update delivery status", "Error");
      throw error;
    }
  };

  const handleContactCustomer = async (customerId) => {
    try {
      const delivery = deliveries.find((d) => d.customerId === customerId);
      if (delivery) {
        // For demo purposes, we'll use a mock phone number
        window.open(`tel:+1-555-CUSTOMER`);
      }
    } catch (error) {
      showError("Failed to contact customer", "Error");
    }
  };

  const handleViewRoute = (deliveryId) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      setTrackingDialogOpen(true);
    }
  };

  const handleRefresh = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccess("Deliveries refreshed", "Success");
    } catch (error) {
      showError("Failed to refresh deliveries", "Error");
    }
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
        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View Order Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewOrderDetails(params.row.orderId)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Track Delivery">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleTrackDelivery(params.row)}
            >
              <TrackIcon fontSize="small" />
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
          </Grid>{" "}
          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>{" "}
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
      {/* Delivery Tracking Dialog */}
      <Dialog
        open={trackingDialogOpen}
        onClose={() => setTrackingDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            height: "80vh",
          },
        }}
      >
        {" "}
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6">
                Track Delivery - {selectedDelivery?.orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer: {selectedDelivery?.customerName}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => {
                  setTrackingDialogOpen(false);
                  handleViewOrderDetails(selectedDelivery?.orderId);
                }}
              >
                View Order
              </Button>
              <IconButton
                onClick={() => setTrackingDialogOpen(false)}
                size="small"
              >
                ×
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedDelivery && (
            <DeliveryTracker
              delivery={selectedDelivery}
              onStatusUpdate={handleStatusUpdate}
              onContactCustomer={handleContactCustomer}
              onViewRoute={handleViewRoute}
              canEdit={true}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeliveriesPage;
