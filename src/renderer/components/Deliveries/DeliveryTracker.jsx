import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  LocalShipping,
  Schedule,
  CheckCircle,
  Error,
  MyLocation,
  Phone,
  Edit,
  Refresh,
  Navigation,
} from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";

const DELIVERY_STATUSES = {
  pending: {
    label: "Pending Assignment",
    color: "warning",
    icon: <Schedule />,
    description: "Waiting for driver assignment",
  },
  assigned: {
    label: "Assigned",
    color: "info",
    icon: <LocalShipping />,
    description: "Driver assigned, preparing for pickup",
  },
  picked_up: {
    label: "Picked Up",
    color: "primary",
    icon: <LocalShipping />,
    description: "Package picked up by driver",
  },
  in_transit: {
    label: "In Transit",
    color: "secondary",
    icon: <Navigation />,
    description: "On the way to customer",
  },
  delivered: {
    label: "Delivered",
    color: "success",
    icon: <CheckCircle />,
    description: "Successfully delivered",
  },
  failed: {
    label: "Failed",
    color: "error",
    icon: <Error />,
    description: "Delivery attempt failed",
  },
  cancelled: {
    label: "Cancelled",
    color: "default",
    icon: <Error />,
    description: "Delivery cancelled",
  },
};

function DeliveryCard({
  delivery,
  onStatusUpdate,
  onContactCustomer,
  onViewRoute,
  canEdit = false,
}) {
  const { showSuccess, showError } = useNotification();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(delivery.status);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const statusInfo = DELIVERY_STATUSES[delivery.status];
  const progressPercentage = getDeliveryProgress(delivery.status);

  const handleStatusUpdate = async () => {
    if (newStatus === delivery.status) {
      setUpdateDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate(delivery.id, newStatus, statusNote);
      showSuccess(
        `Delivery status updated to ${DELIVERY_STATUSES[newStatus].label}`,
        "Status Updated"
      );
      setUpdateDialogOpen(false);
      setStatusNote("");
    } catch (error) {
      showError("Failed to update delivery status", "Error");
    } finally {
      setIsUpdating(false);
    }
  };

  const getEstimatedDeliveryTime = () => {
    if (delivery.estimatedDeliveryTime) {
      const estimatedTime = new Date(delivery.estimatedDeliveryTime);
      return estimatedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "N/A";
  };

  const getTimeElapsed = () => {
    if (delivery.assignedAt) {
      const assigned = new Date(delivery.assignedAt);
      const now = new Date();
      const diffInMinutes = Math.floor((now - assigned) / (1000 * 60));

      if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
      }
      return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`;
    }
    return "N/A";
  };

  return (
    <>
      <Card sx={{ mb: 2, position: "relative" }}>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Order #{delivery.orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {delivery.customerName} • {delivery.customerAddress}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={statusInfo.icon}
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
              />
              {canEdit && (
                <IconButton
                  size="small"
                  onClick={() => setUpdateDialogOpen(true)}
                >
                  <Edit />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box mb={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="body2" color="text.secondary">
                Delivery Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progressPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Delivery Details */}
          <Box
            display="flex"
            justify="space-between"
            flexWrap="wrap"
            gap={2}
            mb={2}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Driver
              </Typography>
              <Typography variant="body2">
                {delivery.driverName || "Not assigned"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Estimated Time
              </Typography>
              <Typography variant="body2">
                {getEstimatedDeliveryTime()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Time Elapsed
              </Typography>
              <Typography variant="body2">{getTimeElapsed()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Priority
              </Typography>
              <Chip
                label={delivery.priority || "Normal"}
                size="small"
                color={delivery.priority === "High" ? "error" : "default"}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              startIcon={<Phone />}
              onClick={() => onContactCustomer(delivery.customerId)}
              variant="outlined"
            >
              Contact Customer
            </Button>
            {delivery.driverPhone && (
              <Button
                size="small"
                startIcon={<Phone />}
                href={`tel:${delivery.driverPhone}`}
                variant="outlined"
              >
                Call Driver
              </Button>
            )}{" "}
            {delivery.trackingData && (
              <Button
                size="small"
                startIcon={<MyLocation />}
                onClick={() => onViewRoute(delivery.id)}
                variant="outlined"
              >
                View Route
              </Button>
            )}
          </Box>

          {/* Last Update */}
          {delivery.lastUpdate && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Last updated: {new Date(delivery.lastUpdate).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              {Object.entries(DELIVERY_STATUSES).map(([value, info]) => (
                <MenuItem key={value} value={value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {info.icon}
                    <Box>
                      <Typography variant="body2">{info.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            label="Status Note (Optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add a note about this status change..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DeliveryTracker({
  deliveries = [],
  loading = false,
  onStatusUpdate,
  onContactCustomer,
  onViewRoute,
  onRefresh,
  filters = {},
  onFilterChange,
}) {
  const [refreshing, setRefreshing] = useState(false);
  const refreshInterval = useRef(null);

  useEffect(() => {
    // Auto-refresh every 30 seconds for active deliveries
    refreshInterval.current = setInterval(() => {
      if (onRefresh) {
        onRefresh();
      }
    }, 30000);

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [onRefresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filters.status && delivery.status !== filters.status) return false;
    if (filters.priority && delivery.priority !== filters.priority)
      return false;
    if (filters.driver && delivery.driverId !== filters.driver) return false;
    return true;
  });

  const groupedDeliveries = filteredDeliveries.reduce((groups, delivery) => {
    const status = delivery.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(delivery);
    return groups;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Refresh */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h1">
          Delivery Tracker
        </Typography>
        <Tooltip title="Refresh deliveries">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            color="primary"
          >
            <Refresh className={refreshing ? "rotate" : ""} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Status Summary */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {Object.entries(DELIVERY_STATUSES).map(([status, info]) => {
          const count = groupedDeliveries[status]?.length || 0;
          return (
            <Chip
              key={status}
              icon={info.icon}
              label={`${info.label}: ${count}`}
              color={info.color}
              variant="outlined"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  status: status === filters.status ? "" : status,
                })
              }
              sx={{
                cursor: "pointer",
                ...(filters.status === status && {
                  bgcolor: `${info.color}.light`,
                  color: `${info.color}.contrastText`,
                }),
              }}
            />
          );
        })}
      </Box>

      {/* Deliveries List */}
      {Object.entries(groupedDeliveries).map(([status, statusDeliveries]) => (
        <Box key={status} mb={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {DELIVERY_STATUSES[status].icon}
            {DELIVERY_STATUSES[status].label}
            <Badge badgeContent={statusDeliveries.length} color="primary" />
          </Typography>

          {statusDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusUpdate={onStatusUpdate}
              onContactCustomer={onContactCustomer}
              onViewRoute={onViewRoute}
              canEdit={true}
            />
          ))}
        </Box>
      ))}

      {filteredDeliveries.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No deliveries found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.status
              ? "Try adjusting your filters"
              : "No deliveries scheduled"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function getDeliveryProgress(status) {
  const progressMap = {
    pending: 0,
    assigned: 20,
    picked_up: 40,
    in_transit: 70,
    delivered: 100,
    failed: 0,
    cancelled: 0,
  };
  return progressMap[status] || 0;
}

export default DeliveryTracker;
export { DeliveryCard, DELIVERY_STATUSES };
