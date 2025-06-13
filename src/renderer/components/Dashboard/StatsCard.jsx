import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material'

function StatsCard({ title, value, subtitle, icon, color = 'primary' }) {
  const getColorByName = (colorName) => {
    const colors = {
      primary: { main: '#1976d2', light: '#e3f2fd' },
      success: { main: '#2e7d32', light: '#e8f5e8' },
      warning: { main: '#ed6c02', light: '#fff3e0' },
      error: { main: '#d32f2f', light: '#ffebee' },
      info: { main: '#0288d1', light: '#e1f5fe' },
    }
    return colors[colorName] || colors.primary
  }

  const colorScheme = getColorByName(color)

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: colorScheme.light,
              color: colorScheme.main,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsCard
