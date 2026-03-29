import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useAnalytics } from "./context/AnalyticsContext";
import { getProductsFromFirestore } from "./services/productsService";
import Shop from "./pages/Shop";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Review from "./pages/Review";
import AboutUs from "./pages/AboutUs";
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

// Persist products in Firestore (shared across all users)
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Firestore on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const firestoreProducts = await getProductsFromFirestore();
        const seedIds = new Set(["p1", "p2", "p3", "p4", "p5", "p6"]);

        // Exclude the old local seed IDs if they still exist in Firestore
        const filteredProducts = firestoreProducts
          .filter((p) => !seedIds.has(p.id))
          .map((p) => ({ ...p, bestSelling: p.bestSelling || false }));

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]); // DB not ready yet, show empty list until DB provides data
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const updateProducts = (next) => {
    setProducts(next);
  };

  return [products, updateProducts, loading];
}

export default function App() {
  usePaystack();
  const [products, setProducts, loading] = useProducts();
  const [view, setView] = useState("shop"); // "shop" | "adminLogin" | "admin" | "review" | "about"
  const [adminAuthed, setAdminAuthed] = useState(false);
  const { trackVisit } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackVisit();
      hasTracked.current = true;
    }
  }, [trackVisit]);

  const goAdmin = () => {
    if (adminAuthed) {
      setView("admin");
    } else {
      setView("adminLogin");
    }
  };

  // Show loading while fetching products
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#888880'
      }}>
        Loading products...
      </div>
    );
  }

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
      {view === "shop" && (
        <Shop
          products={products}
          onAdminClick={goAdmin}
          onReviewClick={() => setView("review")}
          onAboutClick={() => setView("about")}
        />
      )}

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

      {view === "review" && (
        <Review onBackToShop={() => setView("shop")} />
      )}

      {view === "about" && (
        <AboutUs onBackToShop={() => setView("shop")} />
      )}
    </>
  );
}
