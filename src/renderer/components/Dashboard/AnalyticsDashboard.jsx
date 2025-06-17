import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  LocalShipping,
  Inventory,
  People,
  AttachMoney,
  Timeline,
  Refresh,
} from "@mui/icons-material";

const METRIC_TYPES = {
  revenue: { label: "Revenue", icon: <AttachMoney />, color: "success" },
  orders: { label: "Orders", icon: <ShoppingCart />, color: "primary" },
  customers: { label: "Customers", icon: <People />, color: "info" },
  deliveries: {
    label: "Deliveries",
    icon: <LocalShipping />,
    color: "secondary",
  },
  inventory: { label: "Inventory", icon: <Inventory />, color: "warning" },
};

function MetricCard({
  title,
  value,
  change,
  changeType = "increase",
  icon,
  color = "primary",
  subtitle,
  loading = false,
}) {
  const formatValue = (val) => {
    if (typeof val === "number") {
      if (
        title.toLowerCase().includes("revenue") ||
        title.toLowerCase().includes("sales")
      ) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "success.main";
    if (changeType === "decrease") return "error.main";
    return "text.secondary";
  };

  const getChangeIcon = () => {
    if (changeType === "increase") return <TrendingUp />;
    if (changeType === "decrease") return <TrendingDown />;
    return <Timeline />;
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {loading ? "--" : formatValue(value)}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}

        {change !== undefined && !loading && (
          <Box
            display="flex"
            alignItems="center"
            sx={{ mt: 2, color: getChangeColor() }}
          >
            {getChangeIcon()}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {Math.abs(change)}% from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivity({ activities, loading = false }) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Recent Activity</Typography>
          <Tooltip title="Refresh">
            <IconButton size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <List dense>
          {activities.map((activity, index) => (
            <Box key={activity.id || index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: `${activity.color}.light`,
                      color: `${activity.color}.main`,
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(activity.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        {activities.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={3}
          >
            No recent activity
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function TopPerformers({ data, type = "products", loading = false }) {
  const [sortBy, setSortBy] = useState("sales");

  const sortOptions = {
    products: [
      { value: "sales", label: "Sales Volume" },
      { value: "revenue", label: "Revenue" },
      { value: "orders", label: "Order Count" },
    ],
    customers: [
      { value: "orders", label: "Total Orders" },
      { value: "spent", label: "Total Spent" },
      { value: "recent", label: "Recent Activity" },
    ],
  };

  const sortedData =
    data?.sort((a, b) => {
      if (sortBy === "sales") return (b.sales || 0) - (a.sales || 0);
      if (sortBy === "revenue") return (b.revenue || 0) - (a.revenue || 0);
      if (sortBy === "orders") return (b.orders || 0) - (a.orders || 0);
      if (sortBy === "spent") return (b.totalSpent || 0) - (a.totalSpent || 0);
      return 0;
    }) || [];

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top {type === "products" ? "Products" : "Customers"}
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Top {type === "products" ? "Products" : "Customers"}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
            >
              {sortOptions[type]?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <List dense>
          {sortedData.slice(0, 5).map((item, index) => (
            <Box key={item.id || index}>
              <ListItem alignItems="center" sx={{ px: 0 }}>
                <ListItemIcon>
                  <Chip
                    label={index + 1}
                    size="small"
                    color={index < 3 ? "primary" : "default"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={
                    type === "products"
                      ? `${item.sales || 0} sold • $${(
                          item.revenue || 0
                        ).toLocaleString()}`
                      : `${item.orders || 0} orders • $${(
                          item.totalSpent || 0
                        ).toLocaleString()}`
                  }
                />
                <Box textAlign="right">
                  {type === "products" && (
                    <Typography variant="body2" color="success.main">
                      ${(item.revenue || 0).toLocaleString()}
                    </Typography>
                  )}
                  {type === "customers" && (
                    <Typography variant="body2" color="primary.main">
                      {item.orders || 0} orders
                    </Typography>
                  )}
                </Box>
              </ListItem>
              {index < sortedData.length - 1 && index < 4 && <Divider />}
            </Box>
          ))}
        </List>

        {sortedData.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={3}
          >
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard({
  metrics = {},
  activities = [],
  topProducts = [],
  topCustomers = [],
  loading = false,
  onRefresh,
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            color="primary"
          >
            <Refresh className={refreshing ? "rotate" : ""} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={3}>
        {Object.entries(METRIC_TYPES).map(([key, config]) => (
          <Grid item xs={12} sm={6} md={2.4} key={key}>
            <MetricCard
              title={config.label}
              value={metrics[key]?.value || 0}
              change={metrics[key]?.change}
              changeType={metrics[key]?.changeType}
              icon={config.icon}
              color={config.color}
              subtitle={metrics[key]?.subtitle}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Secondary Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RecentActivity activities={activities} loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopPerformers data={topProducts} type="products" loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopPerformers
            data={topCustomers}
            type="customers"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return past.toLocaleDateString();
}

export default AnalyticsDashboard;
export { MetricCard, RecentActivity, TopPerformers };
