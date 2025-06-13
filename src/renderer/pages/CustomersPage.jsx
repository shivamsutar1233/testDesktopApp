import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCustomers, setFilters } from '../store/slices/customersSlice'

const customerStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'blocked', label: 'Blocked' },
]

function CustomersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { customers, isLoading, totalCustomers, currentPage, totalPages, filters } = useSelector(
    (state) => state.customers
  )

  const [searchText, setSearchText] = useState(filters.search || '')
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '')
  const [paginationModel, setPaginationModel] = useState({
    page: currentPage - 1,
    pageSize: 20,
  })

  useEffect(() => {
    dispatch(fetchCustomers({
      page: currentPage,
      limit: 20,
      status: filters.status,
      search: filters.search,
    }))
  }, [dispatch, currentPage, filters])

  const handleSearch = () => {
    dispatch(setFilters({ search: searchText }))
    dispatch(fetchCustomers({
      page: 1,
      limit: 20,
      status: selectedStatus,
      search: searchText,
    }))
  }

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    dispatch(setFilters({ status }))
    dispatch(fetchCustomers({
      page: 1,
      limit: 20,
      status,
      search: filters.search,
    }))
  }

  const handleRefresh = () => {
    dispatch(fetchCustomers({
      page: currentPage,
      limit: 20,
      status: filters.status,
      search: filters.search,
    }))
  }

  const handleRowClick = (params) => {
    navigate(`/customers/${params.id}`)
  }

  const getStatusColor = (status) => {
    const statusColors = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      blocked: 'error',
    }
    return statusColors[status?.toLowerCase()] || 'default'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.row.firstName?.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Customer Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.firstName} {params.row.lastName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 180,
      renderCell: (params) => {
        const address = params.row.addresses?.[0]
        return address ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {address.city}, {address.state}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No address
          </Typography>
        )
      },
    },
    {
      field: 'totalOrders',
      headerName: 'Orders',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value || 0}
        </Typography>
      ),
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          {formatCurrency(params.value || 0)}
        </Typography>
      ),
    },
    {
      field: 'loyaltyPoints',
      headerName: 'Points',
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value || 0}
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={getStatusColor(params.value)}
          variant="outlined"
        />
      ),
    },
    {
      field: 'registrationDate',
      headerName: 'Joined',
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.value)
        return (
          <Typography variant="body2">
            {date.toLocaleDateString()}
          </Typography>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Customer">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Email">
            <IconButton size="small" color="primary">
              <EmailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Customers Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Customer
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {totalCustomers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Customers
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {customers.filter(c => c.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Customers
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New This Week
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search customers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField 
              fullWidth
              size="small"
              select
              label="Status"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {customerStatuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Customers: {totalCustomers}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Customers Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalCustomers}
          loading={isLoading}
          pageSizeOptions={[10, 20, 50]}
          paginationMode="server"
          onRowClick={handleRowClick}
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  )
}

export default CustomersPage
