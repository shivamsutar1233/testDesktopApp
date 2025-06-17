import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { signalRService } from "./services/signalRService.js";
import { NotificationProvider } from "./context/NotificationContext.jsx";

// Layout components
import Layout from "./components/Layout/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// Page components
import Dashboard from "./pages/Dashboard.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import DeliveriesPage from "./pages/DeliveriesPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import CustomerDetailsPage from "./pages/CustomerDetailsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Handle Electron menu events
    if (window.electronAPI) {
      window.electronAPI.onMenuNavigate((route) => {
        navigate(route);
      });

      window.electronAPI.onMenuNewOrder(() => {
        navigate("/orders/new");
      });

      window.electronAPI.onMenuExportData((filePath) => {
        console.log("Export data to:", filePath);
        // Handle export functionality
      });

      // Cleanup listeners on unmount
      return () => {
        window.electronAPI.removeAllListeners("menu-navigate");
        window.electronAPI.removeAllListeners("menu-new-order");
        window.electronAPI.removeAllListeners("menu-export-data");
      };
    }
  }, [navigate]);

  useEffect(() => {
    // Connect to SignalR when authenticated
    if (isAuthenticated) {
      signalRService.connect().catch(console.error);
    } else {
      signalRService.disconnect().catch(console.error);
    }

    // Cleanup on unmount
    return () => {
      signalRService.disconnect().catch(console.error);
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route
                    path="/orders/:orderId"
                    element={<OrderDetailsPage />}
                  />                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route
                    path="/inventory/products/:id"
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path="/inventory/:productId"
                    element={<ProductDetailsPage />}
                  />
                  <Route path="/deliveries" element={<DeliveriesPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route
                    path="/customers/:customerId"
                    element={<CustomerDetailsPage />}
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
