import { createSlice } from '@reduxjs/toolkit'

// Mock initial notifications
const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Chicken Breast is running low (3 items left)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: 'success',
    title: 'Order Delivered',
    message: 'Order #1003 has been successfully delivered to Mike Wilson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'New Order',
    message: 'New order #1004 received from Emma Davis',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 4,
    type: 'error',
    title: 'Delivery Failed',
    message: 'Delivery attempt for order #1001 failed - customer unavailable',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 5,
    type: 'warning',
    title: 'Product Expiring',
    message: 'Sourdough Bread expires in 2 days',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
]

const initialState = {
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  isConnected: false,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      }
      state.notifications.unshift(notification)
      state.unreadCount += 1
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload)
      if (index !== -1) {
        const notification = state.notifications[index]
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications.splice(index, 1)
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload
    },
  },
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setConnectionStatus,
} = notificationsSlice.actions

export default notificationsSlice.reducer
