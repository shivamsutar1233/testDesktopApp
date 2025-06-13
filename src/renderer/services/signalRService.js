import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { store } from '../store/store.js'
import { addNotification, setConnectionStatus } from '../store/slices/notificationsSlice.js'
import { updateOrderInList } from '../store/slices/ordersSlice.js'
import { updateDeliveryInList } from '../store/slices/deliveriesSlice.js'

class SignalRService {
  constructor() {
    this.connection = null
    this.isConnected = false
  }

  async connect() {
    if (this.connection) {
      return
    }

    const token = localStorage.getItem('authToken')
    if (!token) {
      console.warn('No auth token available for SignalR connection')
      return
    }

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_SOCKET_URL}/hubs/notifications`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(LogLevel.Information)
        .build()

      // Set up event handlers
      this.setupEventHandlers()

      // Start the connection
      await this.connection.start()
      this.isConnected = true
      store.dispatch(setConnectionStatus(true))
      
      console.log('SignalR Connected')
    } catch (error) {
      console.error('SignalR Connection Error:', error)
      store.dispatch(setConnectionStatus(false))
    }
  }

  setupEventHandlers() {
    if (!this.connection) return

    // Connection events
    this.connection.onreconnecting((error) => {
      console.log('SignalR Reconnecting:', error)
      this.isConnected = false
      store.dispatch(setConnectionStatus(false))
    })

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected:', connectionId)
      this.isConnected = true
      store.dispatch(setConnectionStatus(true))
    })

    this.connection.onclose((error) => {
      console.log('SignalR Connection Closed:', error)
      this.isConnected = false
      store.dispatch(setConnectionStatus(false))
    })

    // Business events
    this.connection.on('NewOrder', (order) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'New Order Received',
        message: `Order #${order.orderNumber} from ${order.customerName}`,
        data: order,
      }))
    })

    this.connection.on('OrderStatusChanged', (order) => {
      store.dispatch(updateOrderInList(order))
      store.dispatch(addNotification({
        type: 'info',
        title: 'Order Status Updated',
        message: `Order #${order.orderNumber} is now ${order.status}`,
        data: order,
      }))
    })

    this.connection.on('DeliveryStatusChanged', (delivery) => {
      store.dispatch(updateDeliveryInList(delivery))
      store.dispatch(addNotification({
        type: 'info',
        title: 'Delivery Status Updated',
        message: `Delivery #${delivery.id} is now ${delivery.status}`,
        data: delivery,
      }))
    })

    this.connection.on('LowStockAlert', (product) => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.stockQuantity} remaining)`,
        data: product,
      }))
    })

    this.connection.on('DeliveryPersonLocationUpdate', (location) => {
      // Handle delivery person location updates
      console.log('Delivery person location update:', location)
    })

    this.connection.on('SystemAlert', (alert) => {
      store.dispatch(addNotification({
        type: alert.type || 'info',
        title: alert.title || 'System Alert',
        message: alert.message,
        data: alert.data,
      }))
    })
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop()
      this.connection = null
      this.isConnected = false
      store.dispatch(setConnectionStatus(false))
      console.log('SignalR Disconnected')
    }
  }

  async joinGroup(groupName) {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('JoinGroup', groupName)
        console.log(`Joined group: ${groupName}`)
      } catch (error) {
        console.error('Error joining group:', error)
      }
    }
  }

  async leaveGroup(groupName) {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('LeaveGroup', groupName)
        console.log(`Left group: ${groupName}`)
      } catch (error) {
        console.error('Error leaving group:', error)
      }
    }
  }

  async sendMessage(methodName, ...args) {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke(methodName, ...args)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }
}

export const signalRService = new SignalRService()
