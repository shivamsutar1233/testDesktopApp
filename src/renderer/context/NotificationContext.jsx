import { createContext, useContext, useState, useCallback } from "react";
import SnackbarNotification from "../components/Notifications/SnackbarNotification";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      open: true,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after specified duration
    const autoHideDuration = notification.autoHideDuration || 6000;
    setTimeout(() => {
      removeNotification(id);
    }, autoHideDuration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, title) => {
      showNotification({
        message,
        title,
        severity: "success",
      });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message, title) => {
      showNotification({
        message,
        title,
        severity: "error",
        autoHideDuration: 8000,
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message, title) => {
      showNotification({
        message,
        title,
        severity: "warning",
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message, title) => {
      showNotification({
        message,
        title,
        severity: "info",
      });
    },
    [showNotification]
  );

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <SnackbarNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
