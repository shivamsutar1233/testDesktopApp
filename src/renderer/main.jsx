import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store.js";
import AppThemeProvider from "./components/ThemeProvider/AppThemeProvider.jsx";
import App from "./App.jsx";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
