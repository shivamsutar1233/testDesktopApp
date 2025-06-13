import React, { useEffect, useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { inventoryAPI } from '../../services/inventoryService'

function LowStockAlert() {
  const navigate = useNavigate()
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLowStockItems()
  }, [])

  const loadLowStockItems = async () => {
    try {
      const response = await inventoryAPI.getLowStockItems(10)
      setLowStockItems(response.slice(0, 5)) // Show only top 5
    } catch (error) {
      console.error('Error loading low stock items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (lowStockItems.length === 0) {
    return (
      <Box textAlign="center" p={2}>
        <Typography color="text.secondary" variant="body2">
          All items are well stocked!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <List dense>
        {lowStockItems.map((item) => (
          <ListItem 
            key={item.id}
            sx={{ 
              px: 0, 
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
            onClick={() => navigate(`/inventory/${item.id}`)}
          >
            <ListItemText
              primary={item.name}
              secondary={`SKU: ${item.sku}`}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            <ListItemSecondaryAction>
              <Chip
                icon={<WarningIcon />}
                label={`${item.stockQuantity} left`}
                color="warning"
                size="small"
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      
      <Box mt={1} textAlign="center">
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/inventory?lowStock=true')}
        >
          View All Low Stock
        </Button>
      </Box>
    </Box>
  )
}

export default LowStockAlert
