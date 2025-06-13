import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deliveriesAPI } from '../../services/deliveriesService.js'

// Async thunks
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchDeliveries',
  async ({ page = 1, limit = 20, status, deliveryPersonId, date } = {}, { rejectWithValue }) => {
    try {
      const response = await deliveriesAPI.getDeliveries({ page, limit, status, deliveryPersonId, date })
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch deliveries')
    }
  }
)

export const fetchDeliveryPersons = createAsyncThunk(
  'deliveries/fetchDeliveryPersons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deliveriesAPI.getDeliveryPersons()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch delivery persons')
    }
  }
)

export const updateDeliveryStatus = createAsyncThunk(
  'deliveries/updateDeliveryStatus',
  async ({ deliveryId, status, notes, location }, { rejectWithValue }) => {
    try {
      const response = await deliveriesAPI.updateDeliveryStatus(deliveryId, status, notes, location)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update delivery status')
    }
  }
)

export const optimizeRoutes = createAsyncThunk(
  'deliveries/optimizeRoutes',
  async ({ deliveryPersonId, date }, { rejectWithValue }) => {
    try {
      const response = await deliveriesAPI.optimizeRoutes(deliveryPersonId, date)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to optimize routes')
    }
  }
)

const initialState = {
  deliveries: [],
  deliveryPersons: [],
  currentDelivery: null,
  totalDeliveries: 0,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
  optimizedRoutes: [],
  filters: {
    status: '',
    deliveryPersonId: '',
    date: null,
  },
  statistics: {
    pending: 0,
    inProgress: 0,
    delivered: 0,
    failed: 0,
  },
}

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentDelivery: (state) => {
      state.currentDelivery = null
    },
    updateDeliveryInList: (state, action) => {
      const index = state.deliveries.findIndex(delivery => delivery.id === action.payload.id)
      if (index !== -1) {
        state.deliveries[index] = action.payload
      }
    },
    setCurrentDelivery: (state, action) => {
      state.currentDelivery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch deliveries
      .addCase(fetchDeliveries.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.isLoading = false
        state.deliveries = action.payload.deliveries
        state.totalDeliveries = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
        state.statistics = action.payload.statistics || state.statistics
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch delivery persons
      .addCase(fetchDeliveryPersons.fulfilled, (state, action) => {
        state.deliveryPersons = action.payload
      })
      // Update delivery status
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        const index = state.deliveries.findIndex(delivery => delivery.id === action.payload.id)
        if (index !== -1) {
          state.deliveries[index] = action.payload
        }
        if (state.currentDelivery && state.currentDelivery.id === action.payload.id) {
          state.currentDelivery = action.payload
        }
      })
      // Optimize routes
      .addCase(optimizeRoutes.fulfilled, (state, action) => {
        state.optimizedRoutes = action.payload
      })
  },
})

export const { 
  clearError, 
  setFilters, 
  clearCurrentDelivery, 
  updateDeliveryInList, 
  setCurrentDelivery 
} = deliveriesSlice.actions
export default deliveriesSlice.reducer
