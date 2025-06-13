import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'

function RevenueChart({ data }) {
  const { 
    todayRevenue = 0, 
    weekRevenue = 0, 
    monthRevenue = 0,
    averageOrderValue = 0,
    totalOrders = 0
  } = data

  // Mock trend data
  const trends = {
    today: { value: 12.5, isPositive: true },
    week: { value: -3.2, isPositive: false },
    month: { value: 8.7, isPositive: true },
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const RevenueItem = ({ title, amount, trend, period }) => (
    <Box sx={{ textAlign: 'center', p: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {formatCurrency(amount)}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          {trend.isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
          )}
          <Typography 
            variant="caption" 
            color={trend.isPositive ? 'success.main' : 'error.main'}
            fontWeight="bold"
          >
            {Math.abs(trend.value)}%
          </Typography>
        </Box>
      )}
    </Box>
  )

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Revenue Overview
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <RevenueItem
              title="Today"
              amount={todayRevenue}
              trend={trends.today}
            />
          </Grid>
          <Grid item xs={4}>
            <RevenueItem
              title="This Week"
              amount={weekRevenue || todayRevenue * 5} // Mock weekly data
              trend={trends.week}
            />
          </Grid>
          <Grid item xs={4}>
            <RevenueItem
              title="This Month"
              amount={monthRevenue || todayRevenue * 20} // Mock monthly data
              trend={trends.month}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Avg. Order Value
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(averageOrderValue)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {totalOrders}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
