import api from './api.js'

// Mock customers data for development
const MOCK_CUSTOMERS = [
  {
    id: 'cust_001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 555-0123',
    addresses: [
      {
        id: 'addr_001',
        type: 'home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
      }
    ],
    registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastOrderDate: new Date().toISOString(),
    totalOrders: 15,
    totalSpent: 1250.50,
    status: 'active',
    loyaltyPoints: 125,
    preferredDeliveryTime: 'morning'
  },
  {
    id: 'cust_002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 555-0124',
    addresses: [
      {
        id: 'addr_002',
        type: 'home',
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isDefault: true
      }
    ],
    registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastOrderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    totalOrders: 32,
    totalSpent: 2890.75,
    status: 'active',
    loyaltyPoints: 289,
    preferredDeliveryTime: 'afternoon'
  },
  {
    id: 'cust_003',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.w@email.com',
    phone: '+1 555-0125',
    addresses: [
      {
        id: 'addr_003',
        type: 'home',
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        isDefault: true
      }
    ],
    registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastOrderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 8,
    totalSpent: 567.25,
    status: 'active',
    loyaltyPoints: 56,
    preferredDeliveryTime: 'evening'
  }
]

export const customersAPI = {
  async getCustomers({ page = 1, limit = 20, search, status } = {}) {
    // Mock API response
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredCustomers = [...MOCK_CUSTOMERS]
    
    // Apply filters
    if (status && status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.firstName.toLowerCase().includes(searchLower) ||
        customer.lastName.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(search)
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)
    
    return {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCustomers.length / limit)
    }
  },

  async getCustomerById(customerId) {
    const response = await api.get(`/customers/${customerId}`)
    return response
  },

  async getCustomerOrders(customerId, page = 1, limit = 20) {
    const response = await api.get(`/customers/${customerId}/orders?page=${page}&limit=${limit}`)
    return response
  },

  async getCustomerStatistics(customerId) {
    const response = await api.get(`/customers/${customerId}/statistics`)
    return response
  },

  async updateCustomerStatus(customerId, status, reason) {
    const response = await api.patch(`/customers/${customerId}/status`, {
      status,
      reason,
    })
    return response
  },

  async addCustomerNote(customerId, note) {
    const response = await api.post(`/customers/${customerId}/notes`, {
      note,
    })
    return response
  },

  async getCustomerNotes(customerId) {
    const response = await api.get(`/customers/${customerId}/notes`)
    return response
  },

  async exportCustomers(format = 'csv') {
    const response = await api.get(`/customers/export?format=${format}`, {
      responseType: 'blob',
    })
    return response
  },
}
