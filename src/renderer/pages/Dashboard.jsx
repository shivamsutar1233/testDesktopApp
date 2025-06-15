import { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ShoppingCart as OrdersIcon,
  Inventory as InventoryIcon,
  LocalShipping as DeliveryIcon,
  AttachMoney as RevenueIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ordersAPI } from "../services/ordersService";
import { inventoryAPI } from "../services/inventoryService";
import { deliveriesAPI } from "../services/deliveriesService";
import StatsCard from "../components/Dashboard/StatsCard";
import RecentOrders from "../components/Dashboard/RecentOrders";
import LowStockAlert from "../components/Dashboard/LowStockAlert";
import DeliveryStats from "../components/Dashboard/DeliveryStats";
import OrdersChart from "../components/Dashboard/OrdersChart";
import RevenueChart from "../components/Dashboard/RevenueChart";
import { ResponsiveContainer } from "../components/Responsive/ResponsiveComponents";
import useResponsive from "../hooks/useResponsive";
import useTranslation from "../hooks/useTranslation";

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const { isMobile, isTablet, getGridCols } = useResponsive();

  const [stats, setStats] = useState({
    orders: {
      total: 0,
      pending: 0,
      completed: 0,
      todayRevenue: 0,
    },
    inventory: {
      totalProducts: 0,
      lowStockItems: 0,
    },
    deliveries: {
      pending: 0,
      inProgress: 0,
      completed: 0,
      failed: 0,
    },
    customers: {
      total: 0,
      newToday: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];

      // Fetch all dashboard data concurrently
      const [ordersResponse, inventoryResponse, deliveriesResponse] =
        await Promise.all([
          ordersAPI.getOrderStatistics(today, today),
          inventoryAPI.getLowStockItems(),
          deliveriesAPI.getDeliveryStatistics(today, today),
        ]);

      setStats({
        orders: {
          total: ordersResponse.totalOrders || 0,
          pending: ordersResponse.pendingOrders || 0,
          completed: ordersResponse.completedOrders || 0,
          todayRevenue: ordersResponse.todayRevenue || 0,
        },
        inventory: {
          totalProducts: inventoryResponse.totalProducts || 0,
          lowStockItems: inventoryResponse.lowStockCount || 0,
        },
        deliveries: {
          pending: deliveriesResponse.pending || 0,
          inProgress: deliveriesResponse.inProgress || 0,
          completed: deliveriesResponse.completed || 0,
          failed: deliveriesResponse.failed || 0,
        },
        customers: {
          total: ordersResponse.totalCustomers || 0,
          newToday: ordersResponse.newCustomersToday || 0,
        },
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }
  return (
    <ResponsiveContainer>
      {/* Welcome Header */}
      <Box mb={3}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {t("dashboard.welcome", "Welcome back")}, {user?.name || "Manager"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(
            "dashboard.welcomeMessage",
            "Here's what's happening with your grocery delivery business today."
          )}
        </Typography>{" "}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={getGridCols(12, 6, 3)}>
          <StatsCard
            title={t("dashboard.todaysOrders", "Today's Orders")}
            value={stats.orders.total}
            subtitle={`${stats.orders.pending} ${t(
              "orders.pending",
              "pending"
            )}`}
            icon={<OrdersIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={getGridCols(12, 6, 3)}>
          <StatsCard
            title={t("dashboard.revenue", "Revenue")}
            value={`$${stats.orders.todayRevenue.toLocaleString()}`}
            subtitle={t("dashboard.todaysEarnings", "Today's earnings")}
            icon={<RevenueIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={getGridCols(12, 6, 3)}>
          <StatsCard
            title={t("dashboard.activeDeliveries", "Active Deliveries")}
            value={stats.deliveries.inProgress}
            subtitle={`${stats.deliveries.pending} ${t(
              "orders.pending",
              "pending"
            )}`}
            icon={<DeliveryIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={getGridCols(12, 6, 3)}>
          <StatsCard
            title={t("dashboard.lowStockItems", "Low Stock Items")}
            value={stats.inventory.lowStockItems}
            subtitle={t("dashboard.needAttention", "Need attention")}
            icon={<InventoryIcon />}
            color={stats.inventory.lowStockItems > 0 ? "warning" : "success"}
          />{" "}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <OrdersChart
            data={{
              pending: stats.orders.pending,
              inProgress: stats.orders.inProgress || 0,
              delivered: stats.orders.completed,
              total: stats.orders.total,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RevenueChart
            data={{
              todayRevenue: stats.orders.todayRevenue,
              averageOrderValue: stats.orders.averageOrderValue || 0,
              totalOrders: stats.orders.total,
            }}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              {t("dashboard.recentOrders", "Recent Orders")}
            </Typography>
            <RecentOrders limit={isMobile ? 5 : 10} />
          </Paper>
        </Grid>{" "}
        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Low Stock Alert */}
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {t("dashboard.stockAlerts", "Stock Alerts")}
                </Typography>
                <LowStockAlert />
              </Paper>
            </Grid>

            {/* Delivery Stats */}
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {t("dashboard.deliveryPerformance", "Delivery Performance")}
                </Typography>
                <DeliveryStats stats={stats.deliveries} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ResponsiveContainer>
  );
}

export default Dashboard;
