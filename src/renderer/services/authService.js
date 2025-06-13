import api from './api.js'

// Mock user data for development
const MOCK_USER = {
  id: 1,
  email: 'admin@grocerymanager.com',
  name: 'Admin User',
  role: 'admin',
  permissions: ['all']
}

const MOCK_TOKEN = 'mock_jwt_token_123456789'

export const authAPI = {
  async login(email, password) {
    // Mock authentication for development
    if (email === 'admin@grocerymanager.com' && password === 'admin123') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        user: MOCK_USER,
        token: MOCK_TOKEN,
        message: 'Login successful'
      }
    }
    
    // Try real API if mock credentials don't match
    try {
      const response = await api.post('/auth/login', { email, password })
      return response
    } catch (error) {
      // If API fails, throw authentication error
      throw new Error('Invalid email or password')
    }
  },

  async logout() {
    // For mock authentication, just return success
    const token = localStorage.getItem('authToken')
    if (token === MOCK_TOKEN) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: 'Logout successful' }
    }
    
    // Try real API logout
    try {
      const response = await api.post('/auth/logout')
      return response
    } catch (error) {
      // Even if API fails, consider logout successful locally
      return { message: 'Logout successful' }
    }
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response
  },

  async getCurrentUser() {
    // For mock authentication, return mock user if token matches
    const token = localStorage.getItem('authToken')
    if (token === MOCK_TOKEN) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { user: MOCK_USER }
    }
    
    // Try real API
    try {
      const response = await api.get('/auth/me')
      return response
    } catch (error) {
      throw new Error('Failed to get current user')
    }
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    })
    return response
  },
}
