import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

const MOCK_CUSTOMERS = [
  { id: 'cust_001', name: 'John Smith', email: 'john.smith@email.com' },
  { id: 'cust_002', name: 'Sarah Johnson', email: 'sarah.j@email.com' },
  { id: 'cust_003', name: 'Mike Wilson', email: 'mike.w@email.com' },
]

const MOCK_PRODUCTS = [
  { id: 'prod_001', name: 'Organic Bananas', price: 3.99 },
  { id: 'prod_002', name: 'Whole Milk', price: 4.50 },
  { id: 'prod_003', name: 'Sourdough Bread', price: 5.99 },
  { id: 'prod_004', name: 'Chicken Breast', price: 12.99 },
  { id: 'prod_005', name: 'Mixed Vegetables', price: 8.50 },
]

function CreateOrderDialog({ open, onClose, onSubmit }) {
  const [orderData, setOrderData] = useState({
    customerId: null,
    items: [],
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    notes: '',
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const handleCustomerChange = (event, newValue) => {
    setOrderData(prev => ({
      ...prev,
      customerId: newValue?.id || null
    }))
  }

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return

    const existingItemIndex = orderData.items.findIndex(
      item => item.productId === selectedProduct.id
    )

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderData.items]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].quantity * selectedProduct.price
      
      setOrderData(prev => ({ ...prev, items: updatedItems }))
    } else {
      // Add new item
      const newItem = {
        id: `item_${Date.now()}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: selectedProduct.price,
        total: quantity * selectedProduct.price
      }
      
      setOrderData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }))
    }

    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleRemoveItem = (itemId) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleAddressChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value
      }
    }))
  }

  const calculateTotal = () => {
    return orderData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = () => {
    if (!orderData.customerId || orderData.items.length === 0) {
      return
    }

    const orderPayload = {
      ...orderData,
      total: calculateTotal(),
      orderDate: new Date().toISOString(),
      status: 'pending'
    }

    onSubmit(orderPayload)
    handleClose()
  }

  const handleClose = () => {
    setOrderData({
      customerId: null,
      items: [],
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      notes: '',
    })
    setSelectedProduct(null)
    setQuantity(1)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Customer Selection */}
          <Grid item xs={12}>
            <Autocomplete
              options={MOCK_CUSTOMERS}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              onChange={handleCustomerChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Customer"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Add Items Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Autocomplete
                options={MOCK_PRODUCTS}
                getOptionLabel={(option) => `${option.name} - $${option.price}`}
                value={selectedProduct}
                onChange={(event, newValue) => setSelectedProduct(newValue)}
                sx={{ flexGrow: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Product" />
                )}
              />
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                sx={{ width: 120 }}
                inputProps={{ min: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!selectedProduct}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>

            {/* Items Table */}
            {orderData.items.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${calculateTotal().toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>

          {/* Delivery Address */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Delivery Address
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              value={orderData.deliveryAddress.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              value={orderData.deliveryAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="State"
              value={orderData.deliveryAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="ZIP Code"
              value={orderData.deliveryAddress.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Order Notes"
              value={orderData.notes}
              onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Special delivery instructions, customer preferences, etc."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!orderData.customerId || orderData.items.length === 0}
        >
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrderDialog
