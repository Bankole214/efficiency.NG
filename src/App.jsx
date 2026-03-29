import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAnalytics } from "./context/AnalyticsContext";
import { INITIAL_PRODUCTS } from "./data/products";
import Shop from "./pages/Shop";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import "./styles/global.css";

// Load Paystack script once at the app level
function usePaystack() {
  useEffect(() => {
    if (document.querySelector('script[src*="paystack"]')) return;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);
}

// Persist products in localStorage
function useProducts() {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("furni_products");
      const parsed = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
      // Ensure all products have bestSelling property
      return parsed.map((p) => ({ ...p, bestSelling: p.bestSelling || false }));
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const updateProducts = (next) => {
    setProducts(next);
    try {
      localStorage.setItem("furni_products", JSON.stringify(next));
    } catch {}
  };

  return [products, updateProducts];
}

export default function App() {
  usePaystack();
  const [products, setProducts] = useProducts();
  const [view, setView] = useState("shop"); // "shop" | "adminLogin" | "admin"
  const [adminAuthed, setAdminAuthed] = useState(false);
  const { trackVisit } = useAnalytics();

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  const goAdmin = () => {
    if (adminAuthed) {
      setView("admin");
    } else {
      setView("adminLogin");
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1C1C1A",
            color: "#F8F7F4",
            fontSize: "13px",
            borderRadius: "4px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
          success: {
            iconTheme: {
              primary: "#27AE60",
              secondary: "#F8F7F4",
            },
          },
          error: {
            iconTheme: {
              primary: "#C0392B",
              secondary: "#F8F7F4",
            },
          },
        }}
      />
      {view === "shop" && <Shop products={products} onAdminClick={goAdmin} />}

      {view === "adminLogin" && (
        <AdminLogin
          onSuccess={() => {
            setAdminAuthed(true);
            setView("admin");
          }}
          onBack={() => setView("shop")}
        />
      )}

      {view === "admin" && (
        <Admin
          products={products}
          onProductsChange={setProducts}
          onViewShop={() => setView("shop")}
          onSignOut={() => {
            setAdminAuthed(false);
            setView("shop");
          }}
        />
      )}
    </>
  );
}
