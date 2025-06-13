import api from './api.js'

// Mock orders data for development
const MOCK_ORDERS = [
  {
    id: '1001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 555-0123',
    status: 'pending',
    total: 89.50,
    items: [
      { id: 'item_1', productId: 'prod_001', productName: 'Organic Bananas', quantity: 2, price: 3.99, total: 7.98 },
      { id: 'item_2', productId: 'prod_002', productName: 'Whole Milk', quantity: 1, price: 4.50, total: 4.50 },
      { id: 'item_3', productId: 'prod_003', productName: 'Sourdough Bread', quantity: 2, price: 5.99, total: 11.98 }
    ],
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    notes: 'Please leave at front door'
  },
  {
    id: '1002',
    customerId: 'cust_002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1 555-0124',
    status: 'in_progress',
    total: 156.75,
    items: [
      { id: 'item_4', productId: 'prod_004', productName: 'Chicken Breast', quantity: 2, price: 12.99, total: 25.98 },
      { id: 'item_5', productId: 'prod_005', productName: 'Mixed Vegetables', quantity: 3, price: 8.50, total: 25.50 }
    ],
    deliveryAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    notes: 'Ring doorbell'
  },
  {
    id: '1003',
    customerId: 'cust_003',
    customerName: 'Mike Wilson',
    customerEmail: 'mike.w@email.com',
    customerPhone: '+1 555-0125',
    status: 'delivered',
    total: 67.25,
    items: [
      { id: 'item_6', productId: 'prod_006', productName: 'Greek Yogurt', quantity: 4, price: 6.99, total: 27.96 },
      { id: 'item_7', productId: 'prod_007', productName: 'Fresh Strawberries', quantity: 2, price: 7.50, total: 15.00 }
    ],
    deliveryAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    notes: 'Delivered successfully'
  }
]

export const ordersAPI = {
  async getOrders({ page = 1, limit = 20, status, search, dateFrom, dateTo } = {}) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filteredOrders = [...MOCK_ORDERS]
    
    // Apply filters
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredOrders = filteredOrders.filter(order => 
        order.customerName.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower)
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
    
    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    }
  },

  async getOrderById(orderId) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const order = MOCK_ORDERS.find(o => o.id === orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return { order }
  },

  async createOrder(orderData) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newOrder = {
      id: `100${MOCK_ORDERS.length + 1}`,
      ...orderData,
      status: 'pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      paymentStatus: 'pending',
      paymentMethod: 'credit_card'
    }
    
    // Add customer info from mock data
    const customerData = {
      'cust_001': { name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0123' },
      'cust_002': { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0124' },
      'cust_003': { name: 'Mike Wilson', email: 'mike.w@email.com', phone: '+1 555-0125' },
    }
    
    const customer = customerData[orderData.customerId]
    if (customer) {
      newOrder.customerName = customer.name
      newOrder.customerEmail = customer.email
      newOrder.customerPhone = customer.phone
    }
    
    MOCK_ORDERS.unshift(newOrder)
    return { order: newOrder }
  },

  async updateOrderStatus(orderId, status, notes) {
    const response = await api.patch(`/orders/${orderId}/status`, {
      status,
      notes,
    })
    return response
  },

  async assignDelivery(orderId, deliveryPersonId) {
    const response = await api.patch(`/orders/${orderId}/assign-delivery`, {
      deliveryPersonId,
    })
    return response
  },

  async getOrderStatistics(dateFrom, dateTo) {
    const params = new URLSearchParams()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
    
    const response = await api.get(`/orders/statistics?${params}`)
    return response
  },

  async exportOrders(format = 'csv', filters = {}) {
    const params = new URLSearchParams()
    params.append('format', format)
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const response = await api.get(`/orders/export?${params}`, {
      responseType: 'blob',
    })
    return response
  },

  async cancelOrder(orderId, reason) {
    const response = await api.patch(`/orders/${orderId}/cancel`, {
      reason,
    })
    return response
  },

  async refundOrder(orderId, amount, reason) {
    const response = await api.post(`/orders/${orderId}/refund`, {
      amount,
      reason,
    })
    return response
  },

  async getOrderStatistics(dateFrom, dateTo) {
    // Mock API response for dashboard statistics
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = MOCK_ORDERS.filter(order => 
      order.orderDate.split('T')[0] === today
    )
    
    return {
      totalOrders: MOCK_ORDERS.length,
      pendingOrders: MOCK_ORDERS.filter(o => o.status === 'pending').length,
      completedOrders: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      totalCustomers: new Set(MOCK_ORDERS.map(o => o.customerId)).size,
      newCustomersToday: 2, // Mock value
      averageOrderValue: MOCK_ORDERS.length > 0 ? 
        MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0) / MOCK_ORDERS.length : 0
    }
  },
}
