import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  ShoppingCart as OrdersIcon,
  Inventory as InventoryIcon,
  LocalShipping as DeliveryIcon,
  TrendingUp as TrendingUpIcon,
  People as CustomersIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersAPI } from '../services/ordersService'
import { inventoryAPI } from '../services/inventoryService'
import { deliveriesAPI } from '../services/deliveriesService'
import StatsCard from '../components/Dashboard/StatsCard'
import RecentOrders from '../components/Dashboard/RecentOrders'
import LowStockAlert from '../components/Dashboard/LowStockAlert'
import DeliveryStats from '../components/Dashboard/DeliveryStats'
import OrdersChart from '../components/Dashboard/OrdersChart'
import RevenueChart from '../components/Dashboard/RevenueChart'

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
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
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const today = new Date().toISOString().split('T')[0]
      
      // Fetch all dashboard data concurrently
      const [ordersResponse, inventoryResponse, deliveriesResponse] = await Promise.all([
        ordersAPI.getOrderStatistics(today, today),
        inventoryAPI.getLowStockItems(),
        deliveriesAPI.getDeliveryStatistics(today, today),
      ])

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
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.name || 'Manager'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your grocery delivery business today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Today's Orders"
            value={stats.orders.total}
            subtitle={`${stats.orders.pending} pending`}
            icon={<OrdersIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Revenue"
            value={`$${stats.orders.todayRevenue.toLocaleString()}`}
            subtitle="Today's earnings"
            icon={<RevenueIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Deliveries"
            value={stats.deliveries.inProgress}
            subtitle={`${stats.deliveries.pending} pending`}
            icon={<DeliveryIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Low Stock Items"
            value={stats.inventory.lowStockItems}
            subtitle="Need attention"
            icon={<InventoryIcon />}
            color={stats.inventory.lowStockItems > 0 ? "warning" : "success"}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <OrdersChart 
            data={{
              pending: stats.orders.pending,
              inProgress: stats.orders.inProgress || 0,
              delivered: stats.orders.completed,
              total: stats.orders.total
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RevenueChart 
            data={{
              todayRevenue: stats.orders.todayRevenue,
              averageOrderValue: stats.orders.averageOrderValue || 0,
              totalOrders: stats.orders.total
            }}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Recent Orders
            </Typography>
            <RecentOrders />
          </Paper>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Low Stock Alert */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Stock Alerts
                </Typography>
                <LowStockAlert />
              </Paper>
            </Grid>

            {/* Delivery Stats */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Delivery Performance
                </Typography>
                <DeliveryStats stats={stats.deliveries} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
