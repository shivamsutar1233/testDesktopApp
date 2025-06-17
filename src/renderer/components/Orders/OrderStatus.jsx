import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  LocalShipping,
  Restaurant,
  Cancel,
  Edit,
} from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";

const ORDER_STATUSES = {
  pending: { label: "Pending", color: "warning", icon: <Schedule /> },
  confirmed: { label: "Confirmed", color: "info", icon: <CheckCircle /> },
  preparing: { label: "Preparing", color: "primary", icon: <Restaurant /> },
  ready: {
    label: "Ready for Delivery",
    color: "success",
    icon: <CheckCircle />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "secondary",
    icon: <LocalShipping />,
  },
  delivered: { label: "Delivered", color: "success", icon: <CheckCircle /> },
  cancelled: { label: "Cancelled", color: "error", icon: <Cancel /> },
};

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

function OrderStatus({ order, onStatusUpdate, canEdit = false }) {
  const { showSuccess, showError } = useNotification() || {};
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(order?.status || "pending");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Early return if order is null or undefined
  if (!order) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <Alert severity="warning">No order data available</Alert>
        </CardContent>
      </Card>
    );
  }

  const currentStatusInfo =
    ORDER_STATUSES[order?.status] || ORDER_STATUSES.pending;
  const currentStepIndex = STATUS_STEPS.indexOf(order?.status || "pending");
  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) {
      setEditDialogOpen(false);
      return;
    }

    if (!order?.id) {
      showError?.("Order ID is missing", "Error");
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate?.(order.id, newStatus, statusNote);
      showSuccess?.(
        `Order status updated to ${
          ORDER_STATUSES[newStatus]?.label || newStatus
        }`,
        "Status Updated"
      );
      setEditDialogOpen(false);
      setStatusNote("");
    } catch (error) {
      showError?.("Failed to update order status", "Error");
    } finally {
      setIsUpdating(false);
    }
  };
  const getStatusColor = (status) => {
    if (!status) return "default";
    if (order?.status === "cancelled") return "error";
    if (STATUS_STEPS.indexOf(status) <= currentStepIndex) return "success";
    return "default";
  };

  const isStepCompleted = (stepIndex) => {
    if (order?.status === "cancelled") return false;
    return stepIndex < currentStepIndex;
  };

  const isStepActive = (stepIndex) => {
    if (order?.status === "cancelled") return false;
    return stepIndex === currentStepIndex;
  };

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {" "}
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={currentStatusInfo?.icon}
              label={currentStatusInfo?.label || "Unknown Status"}
              color={currentStatusInfo?.color || "default"}
              variant="filled"
            />
            {canEdit && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditDialogOpen(true)}
              >
                Update Status
              </Button>
            )}
          </Box>
        </Box>
        {order?.status === "cancelled" ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This order has been cancelled.
            </Typography>
          </Alert>
        ) : (
          <Stepper
            activeStep={currentStepIndex}
            orientation="vertical"
            sx={{ mt: 2 }}
          >
            {" "}
            {STATUS_STEPS?.map((status, index) => (
              <Step
                key={status}
                completed={isStepCompleted(index)}
                active={isStepActive(index)}
              >
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color: getStatusColor(status),
                      "&.Mui-completed": {
                        color: "success.main",
                      },
                      "&.Mui-active": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  {ORDER_STATUSES[status]?.label || status}
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {getStatusDescription(status)}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}{" "}
        {order?.statusHistory &&
          Array.isArray(order.statusHistory) &&
          order.statusHistory.length > 0 && (
            <Box mt={3}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Status History
              </Typography>
              {order.statusHistory?.map((entry, index) => (
                <Box key={index} mb={1}>
                  {" "}
                  <Typography variant="body2">
                    <strong>
                      {ORDER_STATUSES[entry?.status]?.label ||
                        entry?.status ||
                        "Unknown"}
                    </strong>
                    {" - "}
                    {entry?.timestamp
                      ? (() => {
                          try {
                            return new Date(entry.timestamp).toLocaleString();
                          } catch (error) {
                            return "Invalid date";
                          }
                        })()
                      : "Unknown time"}
                  </Typography>
                  {entry?.note && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      Note: {entry.note}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
      </CardContent>

      {/* Status Update Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Status</InputLabel>{" "}
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              {Object.entries(ORDER_STATUSES)?.map(([value, info]) => (
                <MenuItem key={value} value={value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {info?.icon}
                    {info?.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>{" "}
          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            label="Status Note (Optional)"
            value={statusNote || ""}
            onChange={(e) => setStatusNote(e.target.value || "")}
            placeholder="Add a note about this status change..."
          />
        </DialogContent>{" "}
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={isUpdating || !newStatus}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function getStatusDescription(status) {
  if (!status) return "";

  const descriptions = {
    pending: "Order received and awaiting confirmation",
    confirmed: "Order confirmed and being processed",
    preparing: "Items are being prepared for delivery",
    ready: "Order is ready and waiting for pickup",
    out_for_delivery: "Order is on its way to the customer",
    delivered: "Order has been successfully delivered",
  };

  return descriptions[status] || "";
}

export default OrderStatus;
