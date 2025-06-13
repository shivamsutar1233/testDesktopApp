import api from './api.js'

// Mock deliveries data for development
const MOCK_DELIVERIES = [
  {
    id: 'del_001',
    orderId: '1001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    deliveryPersonId: 'dp_001',
    deliveryPersonName: 'Alex Rodriguez',
    status: 'pending',
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    notes: 'Please leave at front door',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'del_002',
    orderId: '1002',
    customerId: 'cust_002',
    customerName: 'Sarah Johnson',
    deliveryPersonId: 'dp_002',
    deliveryPersonName: 'Maria Garcia',
    status: 'in_progress',
    estimatedDelivery: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    deliveryAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    notes: 'Ring doorbell',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'del_003',
    orderId: '1003',
    customerId: 'cust_003',
    customerName: 'Mike Wilson',
    deliveryPersonId: 'dp_001',
    deliveryPersonName: 'Alex Rodriguez',
    status: 'delivered',
    estimatedDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actualDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    notes: 'Delivered successfully',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

export const deliveriesAPI = {
  async getDeliveries({ page = 1, limit = 20, status, deliveryPersonId, date } = {}) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredDeliveries = [...MOCK_DELIVERIES]
    
    // Apply filters
    if (status && status !== 'all') {
      filteredDeliveries = filteredDeliveries.filter(delivery => delivery.status === status)
    }
    
    if (deliveryPersonId) {
      filteredDeliveries = filteredDeliveries.filter(delivery => 
        delivery.deliveryPersonId === deliveryPersonId
      )
    }
    
    if (date) {
      filteredDeliveries = filteredDeliveries.filter(delivery => 
        delivery.createdAt.split('T')[0] === date
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex)
    
    return {
      deliveries: paginatedDeliveries,
      total: filteredDeliveries.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDeliveries.length / limit)
    }
  },

  async getDeliveryById(deliveryId) {
    const response = await api.get(`/deliveries/${deliveryId}`)
    return response
  },

  async updateDeliveryStatus(deliveryId, status, notes, location) {
    const response = await api.patch(`/deliveries/${deliveryId}/status`, {
      status,
      notes,
      location,
    })
    return response
  },

  async getDeliveryPersons() {
    const response = await api.get('/delivery-persons')
    return response
  },

  async createDeliveryPerson(personData) {
    const response = await api.post('/delivery-persons', personData)
    return response
  },

  async updateDeliveryPerson(personId, personData) {
    const response = await api.put(`/delivery-persons/${personId}`, personData)
    return response
  },

  async getDeliveryPersonPerformance(personId, dateFrom, dateTo) {
    const params = new URLSearchParams()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
    
    const response = await api.get(`/delivery-persons/${personId}/performance?${params}`)
    return response
  },

  async optimizeRoutes(deliveryPersonId, date) {
    const response = await api.post('/deliveries/optimize-routes', {
      deliveryPersonId,
      date,
    })
    return response
  },

  async trackDelivery(deliveryId) {
    const response = await api.get(`/deliveries/${deliveryId}/track`)
    return response
  },

  async getDeliveryStatistics(dateFrom, dateTo) {
    // Mock API response for dashboard
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      pending: MOCK_DELIVERIES.filter(d => d.status === 'pending').length,
      inProgress: MOCK_DELIVERIES.filter(d => d.status === 'in_progress').length,
      completed: MOCK_DELIVERIES.filter(d => d.status === 'delivered').length,
      failed: MOCK_DELIVERIES.filter(d => d.status === 'failed').length,
      totalDeliveries: MOCK_DELIVERIES.length,
      onTimeRate: 95.5, // Mock percentage
      averageDeliveryTime: 45 // Mock minutes
    }
  },

  async assignBulkDeliveries(deliveryPersonId, orderIds) {
    const response = await api.post('/deliveries/bulk-assign', {
      deliveryPersonId,
      orderIds,
    })
    return response
  },
}
