import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { inventoryAPI } from '../../services/inventoryService.js'

// Async thunks
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async ({ page = 1, limit = 20, category, search, lowStock } = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.getProducts({ page, limit, category, search, lowStock })
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'inventory/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.getProductById(productId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.createProduct(productData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.updateProduct(productId, productData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product')
    }
  }
)

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ productId, quantity, type, notes }, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.updateStock(productId, quantity, type, notes)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'inventory/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.getCategories()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
    }
  }
)

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
  lowStockItems: [],
  filters: {
    category: '',
    search: '',
    lowStock: false,
  },
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    updateProductInList: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
        state.lowStockItems = action.payload.lowStockItems || []
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
        state.totalProducts += 1
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { clearError, setFilters, clearCurrentProduct, updateProductInList } = inventorySlice.actions
export default inventorySlice.reducer
