import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import ordersReducer from "./slices/ordersSlice.js";
import inventoryReducer from "./slices/inventorySlice.js";
import deliveriesReducer from "./slices/deliveriesSlice.js";
import customersReducer from "./slices/customersSlice.js";
import notificationsReducer from "./slices/notificationsSlice.js";
import userPreferencesReducer from "./slices/userPreferencesSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    inventory: inventoryReducer,
    deliveries: deliveriesReducer,
    customers: customersReducer,
    notifications: notificationsReducer,
    userPreferences: userPreferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
