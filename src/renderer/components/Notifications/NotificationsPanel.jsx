import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Chip,
  Badge,
} from '@mui/material'
import {
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from '../../store/slices/notificationsSlice'

function NotificationsPanel({ open, onClose }) {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state) => state.notifications)

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleRemoveNotification = (notificationId) => {
    dispatch(removeNotification(notificationId))
  }

  const handleClearAll = () => {
    dispatch(clearAllNotifications())
  }

  const getNotificationColor = (type) => {
    const colors = {
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
    }
    return colors[type] || 'default'
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400 },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
            {unreadCount > 0 && (
              <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {notifications.length > 0 && (
          <Box display="flex" gap={1} mb={2}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </Box>
        )}

        <Divider />

        {notifications.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  px: 0,
                  py: 1,
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography
                        variant="subtitle2"
                        fontWeight={notification.read ? 'normal' : 'bold'}
                      >
                        {notification.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={getNotificationColor(notification.type)}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveNotification(notification.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.timestamp)}
                      </Typography>
                      {!notification.read && (
                        <Button
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ ml: 1 }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  )
}

export default NotificationsPanel
