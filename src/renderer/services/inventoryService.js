import api from './api.js'

// Mock inventory data for development
const MOCK_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas from local farms',
    category: 'Fruits',
    price: 3.99,
    cost: 2.50,
    sku: 'BAN-ORG-001',
    stock: 50,
    minStock: 10,
    maxStock: 100,
    unit: 'bunch',
    supplier: 'Local Farms Co.',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
    isActive: true
  },
  {
    id: 'prod_002',
    name: 'Whole Milk',
    description: 'Fresh whole milk, 1 gallon',
    category: 'Dairy',
    price: 4.50,
    cost: 3.00,
    sku: 'MLK-WHL-001',
    stock: 25,
    minStock: 15,
    maxStock: 50,
    unit: 'gallon',
    supplier: 'Dairy Fresh Inc.',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
    isActive: true
  },
  {
    id: 'prod_003',
    name: 'Sourdough Bread',
    description: 'Artisan sourdough bread, freshly baked',
    category: 'Bakery',
    price: 5.99,
    cost: 3.50,
    sku: 'BRD-SOU-001',
    stock: 8,
    minStock: 5,
    maxStock: 30,
    unit: 'loaf',
    supplier: 'Artisan Bakery',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    isActive: true
  },
  {
    id: 'prod_004',
    name: 'Chicken Breast',
    description: 'Boneless skinless chicken breast, per lb',
    category: 'Meat',
    price: 12.99,
    cost: 8.50,
    sku: 'CHK-BRS-001',
    stock: 3,
    minStock: 10,
    maxStock: 40,
    unit: 'lb',
    supplier: 'Premium Meats Ltd.',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200',
    isActive: true
  },
  {
    id: 'prod_005',
    name: 'Mixed Vegetables',
    description: 'Frozen mixed vegetables blend',
    category: 'Frozen',
    price: 8.50,
    cost: 5.00,
    sku: 'VEG-MIX-001',
    stock: 45,
    minStock: 20,
    maxStock: 80,
    unit: 'bag',
    supplier: 'Frozen Foods Corp.',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200',
    isActive: true
  }
]

export const inventoryAPI = {
  async getProducts({ page = 1, limit = 20, category, search, lowStock = false } = {}) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 600))
    
    let filteredProducts = [...MOCK_PRODUCTS]
    
    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      )
    }
    
    if (lowStock) {
      filteredProducts = filteredProducts.filter(product => 
        product.stock <= product.minStock
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    }
  },

  async getProductById(productId) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const product = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return { product }
  },

  async createProduct(productData) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    }
    
    MOCK_PRODUCTS.unshift(newProduct)
    return { product: newProduct }
  },

  async updateProduct(productId, productData) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 700))
    
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === productId)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }
    
    MOCK_PRODUCTS[productIndex] = {
      ...MOCK_PRODUCTS[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    }
    
    return { product: MOCK_PRODUCTS[productIndex] }
  },

  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`)
    return response
  },

  async updateStock(productId, quantity, type, notes) {
    const response = await api.patch(`/products/${productId}/stock`, {
      quantity,
      type, // 'add', 'remove', 'set'
      notes,
    })
    return response
  },

  async getCategories() {
    const response = await api.get('/categories')
    return response
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData)
    return response
  },

  async updateCategory(categoryId, categoryData) {
    const response = await api.put(`/categories/${categoryId}`, categoryData)
    return response
  },

  async deleteCategory(categoryId) {
    const response = await api.delete(`/categories/${categoryId}`)
    return response
  },

  async getLowStockItems(threshold = 10) {
    const response = await api.get(`/products/low-stock?threshold=${threshold}`)
    return response
  },

  async getStockHistory(productId, page = 1, limit = 20) {
    const response = await api.get(`/products/${productId}/stock-history?page=${page}&limit=${limit}`)
    return response
  },

  async bulkUpdatePrices(updates) {
    const response = await api.patch('/products/bulk-price-update', { updates })
    return response
  },

  async importProducts(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  async exportProducts(format = 'csv') {
    const response = await api.get(`/products/export?format=${format}`, {
      responseType: 'blob',
    })
    return response
  },

  async getLowStockItems() {
    // Mock API response for dashboard
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const lowStockProducts = MOCK_PRODUCTS.filter(product => 
      product.stock <= product.minStock
    )
    
    return {
      totalProducts: MOCK_PRODUCTS.length,
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts,
      outOfStockCount: MOCK_PRODUCTS.filter(p => p.stock === 0).length
    }
  },
}
