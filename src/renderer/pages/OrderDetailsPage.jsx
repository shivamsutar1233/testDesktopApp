import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import {
  ArrowBack,
  Edit,
  Print,
  Share,
  LocalShipping,
  Person,
  Phone,
  Email,
  LocationOn,
  Schedule,
  CheckCircle,
  Info,
  Receipt,
  Inventory,
  Notes,
  History,
  Cancel,
  Refresh,
} from "@mui/icons-material";
import { useNotification } from "../context/NotificationContext";
import OrderStatus from "../components/Orders/OrderStatus";
import { DeliveryCard } from "../components/Deliveries/DeliveryTracker";

// Mock data - in real app, this would come from API
const mockOrderData = {
  id: "ORD-2024-001",
  orderNumber: "ORD-2024-001",
  status: "confirmed",
  priority: "High",
  totalAmount: 156.75,
  subtotal: 142.5,
  tax: 14.25,
  discount: 0,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T14:20:00Z",
  estimatedDelivery: "2024-01-16T16:00:00Z",
  paymentStatus: "paid",
  paymentMethod: "Credit Card",
  customer: {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0123",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    avatar: null,
  },
  items: [
    {
      id: 1,
      productId: "PROD-001",
      name: "Organic Bananas",
      category: "Fruits",
      quantity: 3,
      unit: "lbs",
      unitPrice: 2.99,
      totalPrice: 8.97,
      image: null,
      notes: "Ripe, not too green",
    },
    {
      id: 2,
      productId: "PROD-002",
      name: "Fresh Spinach",
      category: "Vegetables",
      quantity: 2,
      unit: "bunches",
      unitPrice: 3.49,
      totalPrice: 6.98,
      image: null,
      notes: null,
    },
    {
      id: 3,
      productId: "PROD-003",
      name: "Whole Milk",
      category: "Dairy",
      quantity: 1,
      unit: "gallon",
      unitPrice: 4.29,
      totalPrice: 4.29,
      image: null,
      notes: null,
    },
  ],
  delivery: {
    id: "DEL-001",
    status: "assigned",
    driverId: "DRV-001",
    driverName: "Mike Johnson",
    driverPhone: "+1 555-0456",
    estimatedTime: "2024-01-16T16:00:00Z",
    trackingNumber: "TRK-123456789",
    instructions: "Leave at front door if no answer",
  },
  history: [
    {
      id: 1,
      action: "Order Created",
      description: "Order placed by customer",
      timestamp: "2024-01-15T10:30:00Z",
      user: "System",
      type: "info",
    },
    {
      id: 2,
      action: "Payment Processed",
      description: "Payment of $156.75 processed successfully",
      timestamp: "2024-01-15T10:32:00Z",
      user: "Payment Gateway",
      type: "success",
    },
    {
      id: 3,
      action: "Order Confirmed",
      description: "Order confirmed and sent to fulfillment",
      timestamp: "2024-01-15T11:15:00Z",
      user: "Sarah Johnson",
      type: "success",
    },
    {
      id: 4,
      action: "Delivery Assigned",
      description: "Assigned to driver Mike Johnson",
      timestamp: "2024-01-15T14:20:00Z",
      user: "Dispatch System",
      type: "info",
    },
  ],
  notes: [
    {
      id: 1,
      content: "Customer prefers contactless delivery",
      author: "Sarah Johnson",
      timestamp: "2024-01-15T11:20:00Z",
      type: "internal",
    },
  ],
};

const ORDER_STATUSES = {
  pending: { label: "Pending", color: "warning", icon: <Schedule /> },
  confirmed: { label: "Confirmed", color: "info", icon: <CheckCircle /> },
  processing: { label: "Processing", color: "primary", icon: <Inventory /> },
  shipped: { label: "Shipped", color: "secondary", icon: <LocalShipping /> },
  delivered: { label: "Delivered", color: "success", icon: <CheckCircle /> },
  cancelled: { label: "Cancelled", color: "error", icon: <Cancel /> },
};

const PAYMENT_STATUSES = {
  pending: { label: "Pending", color: "warning" },
  paid: { label: "Paid", color: "success" },
  failed: { label: "Failed", color: "error" },
  refunded: { label: "Refunded", color: "info" },
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [order, setOrder] = useState(mockOrderData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingOrder, setEditingOrder] = useState({});

  useEffect(() => {
    // In real app, fetch order data based on ID
    if (id && id !== order.id) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [id, order.id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setOrder((prev) => ({ ...prev, status: newStatus }));
      showSuccess(`Order status updated to ${ORDER_STATUSES[newStatus].label}`);
    } catch (error) {
      showError("Failed to update order status");
    }
  };

  const handleEditOrder = () => {
    setEditingOrder({ ...order });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setOrder(editingOrder);
      setEditDialogOpen(false);
      showSuccess("Order updated successfully");
    } catch (error) {
      showError("Failed to update order");
    }
  };

  const handleCancelOrder = async () => {
    try {
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
      setCancelDialogOpen(false);
      showSuccess("Order cancelled successfully");
    } catch (error) {
      showError("Failed to cancel order");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const note = {
        id: Date.now(),
        content: newNote,
        author: "Current User",
        timestamp: new Date().toISOString(),
        type: "internal",
      };

      setOrder((prev) => ({
        ...prev,
        notes: [...prev.notes, note],
      }));

      setNoteDialogOpen(false);
      setNewNote("");
      showSuccess("Note added successfully");
    } catch (error) {
      showError("Failed to add note");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const statusInfo = ORDER_STATUSES[order.status];
  const paymentInfo = PAYMENT_STATUSES[order.paymentStatus];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDateTime(order.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Print Order">
            <IconButton onClick={handlePrint}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share Order">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEditOrder}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                {statusInfo.icon}
                <Box>
                  <Typography variant="h6">
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order Total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  color={statusInfo.color}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Order Status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip label={paymentInfo.label} color={paymentInfo.color} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Schedule />
                <Box>
                  <Typography variant="body2">
                    {formatDateTime(order.estimatedDelivery)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Est. Delivery
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Order Details" icon={<Receipt />} />
          <Tab label="Customer Info" icon={<Person />} />
          <Tab label="Delivery" icon={<LocalShipping />} />
          <Tab label="History" icon={<History />} />
          <Tab label="Notes" icon={<Notes />} />
        </Tabs>

        {/* Order Details Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader title="Order Items" />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ width: 40, height: 40 }}>
                                  {item.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {item.category}
                                  </Typography>
                                  {item.notes && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      Note: {item.notes}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.totalPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Order Summary" />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(order.subtotal)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax:</Typography>
                    <Typography>{formatCurrency(order.tax)}</Typography>
                  </Box>
                  {order.discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Discount:</Typography>
                      <Typography color="success.main">
                        -{formatCurrency(order.discount)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>

                  <Box mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2">
                      {order.paymentMethod}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mt: 2 }}>
                <CardHeader title="Order Status" />
                <CardContent>
                  <OrderStatus
                    currentStatus={order.status}
                    onStatusUpdate={handleStatusUpdate}
                    timeline={order.history}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Customer Info Tab */}
        <TabPanel value={activeTab} index={1}>
          <Card>
            <CardHeader title="Customer Information" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ width: 60, height: 60 }}>
                      {order.customer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {order.customer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer ID: {order.customer.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Email />
                    <Typography>{order.customer.email}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Phone />
                    <Typography>{order.customer.phone}</Typography>
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <LocationOn />
                    <Box>
                      <Typography>{order.customer.address}</Typography>
                      <Typography>
                        {order.customer.city}, {order.customer.state}{" "}
                        {order.customer.zipCode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      href={`tel:${order.customer.phone}`}
                    >
                      Call Customer
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Email />}
                      href={`mailto:${order.customer.email}`}
                    >
                      Send Email
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>        {/* Delivery Tab */}
        <TabPanel value={activeTab} index={2}>
          {order.delivery && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Delivery Information</Typography>
                <Button
                  variant="outlined"
                  startIcon={<LocalShipping />}
                  onClick={() => navigate('/deliveries', { 
                    state: { highlightDelivery: order.delivery.id } 
                  })}
                >
                  View in Deliveries Page
                </Button>
              </Box>
              <DeliveryCard
                delivery={{
                  id: order.delivery.id,
                  orderId: order.id,
                  status: order.delivery.status,
                  customerName: order.customer.name,
                  customerAddress: order.customer.address,
                  customerId: order.customer.id,
                  driverName: order.delivery.driverName,
                  driverPhone: order.delivery.driverPhone,
                  estimatedDeliveryTime: order.delivery.estimatedTime,
                  priority: order.priority,
                  trackingData: order.delivery.trackingNumber,
                  lastUpdate: order.updatedAt,
                }}
                onStatusUpdate={() => {}}
                onContactCustomer={() => {}}
                onViewRoute={() => {}}
                canEdit={true}
              />
            </Box>
          )}
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={activeTab} index={3}>
          <Card>
            <CardHeader title="Order History" />
            <CardContent>
              <Timeline>
                {order.history.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineSeparator>
                      <TimelineDot
                        color={event.type === "success" ? "success" : "primary"}
                      >
                        {event.type === "success" ? <CheckCircle /> : <Info />}
                      </TimelineDot>
                      {index < order.history.length - 1 && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">
                        {event.action}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(event.timestamp)} • {event.user}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Notes Tab */}
        <TabPanel value={activeTab} index={4}>
          <Card>
            <CardHeader
              title="Order Notes"
              action={
                <Button
                  variant="contained"
                  startIcon={<Notes />}
                  onClick={() => setNoteDialogOpen(true)}
                >
                  Add Note
                </Button>
              }
            />
            <CardContent>
              {order.notes.length === 0 ? (
                <Typography color="text.secondary">
                  No notes added yet
                </Typography>
              ) : (
                order.notes.map((note) => (
                  <Card key={note.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" mb={1}>
                        {note.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(note.timestamp)} • {note.author}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditOrder}
            >
              Edit Order
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              color="error"
              onClick={() => setCancelDialogOpen(true)}
              disabled={
                order.status === "cancelled" || order.status === "delivered"
              }
            >
              Cancel Order
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
            <Button
              variant="outlined"
              startIcon={<Notes />}
              onClick={() => setNoteDialogOpen(true)}
            >
              Add Note
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingOrder.status || ""}
                  onChange={(e) =>
                    setEditingOrder((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  label="Status"
                >
                  {Object.entries(ORDER_STATUSES).map(([value, info]) => (
                    <MenuItem key={value} value={value}>
                      {info.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingOrder.priority || ""}
                  onChange={(e) =>
                    setEditingOrder((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The order will be cancelled and the
            customer will be notified.
          </Alert>
          <Typography>
            Are you sure you want to cancel order #{order.orderNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Order</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!newNote.trim()}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderDetailsPage;
