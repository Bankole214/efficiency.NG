import React from "react";
import ReactDOM from "react-dom/client";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { CartProvider } from "./context/CartContext";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnalyticsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AnalyticsProvider>
  </React.StrictMode>,
);
