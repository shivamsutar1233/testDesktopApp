import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { customersAPI } from '../../services/customersService.js'

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ page = 1, limit = 20, search, status } = {}, { rejectWithValue }) => {
    try {
      const response = await customersAPI.getCustomers({ page, limit, search, status })
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers')
    }
  }
)

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customersAPI.getCustomerById(customerId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer')
    }
  }
)

export const fetchCustomerOrders = createAsyncThunk(
  'customers/fetchCustomerOrders',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customersAPI.getCustomerOrders(customerId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer orders')
    }
  }
)

const initialState = {
  customers: [],
  currentCustomer: null,
  currentCustomerOrders: [],
  totalCustomers: 0,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: '',
  },
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null
      state.currentCustomerOrders = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload.customers
        state.totalCustomers = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCustomer = action.payload
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch customer orders
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.currentCustomerOrders = action.payload
      })
  },
})

export const { clearError, setFilters, clearCurrentCustomer } = customersSlice.actions
export default customersSlice.reducer
