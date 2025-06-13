import React from 'react'
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Chip,
} from '@mui/material'

function DeliveryStats({ stats }) {
  const total = stats.pending + stats.inProgress + stats.completed + stats.failed
  
  const getPercentage = (value) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  const deliveryData = [
    { label: 'Completed', value: stats.completed, color: 'success', percentage: getPercentage(stats.completed) },
    { label: 'In Progress', value: stats.inProgress, color: 'info', percentage: getPercentage(stats.inProgress) },
    { label: 'Pending', value: stats.pending, color: 'warning', percentage: getPercentage(stats.pending) },
    { label: 'Failed', value: stats.failed, color: 'error', percentage: getPercentage(stats.failed) },
  ]

  if (total === 0) {
    return (
      <Box textAlign="center" p={2}>
        <Typography color="text.secondary" variant="body2">
          No delivery data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {deliveryData.map((item) => (
        <Box key={item.label} mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">{item.label}</Typography>
            <Chip 
              label={item.value} 
              size="small" 
              color={item.color}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={item.percentage}
            color={item.color}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary">
            {item.percentage.toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default DeliveryStats
