import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material'

function OrdersChart({ data }) {
  const { pending = 0, inProgress = 0, delivered = 0, total = 0 } = data

  const getPercentage = (value) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  const statusData = [
    { label: 'Pending', value: pending, color: '#ff9800', percentage: getPercentage(pending) },
    { label: 'In Progress', value: inProgress, color: '#2196f3', percentage: getPercentage(inProgress) },
    { label: 'Delivered', value: delivered, color: '#4caf50', percentage: getPercentage(delivered) },
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Status Distribution
        </Typography>
        <Box sx={{ mt: 2 }}>
          {statusData.map((item) => (
            <Box key={item.label} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {item.value} ({item.percentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: item.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        {total === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            No orders data available
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default OrdersChart
