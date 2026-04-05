import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useAnalytics } from "./context/AnalyticsContext";
import { getProductsFromFirestore } from "./services/productsService";
import { getCategoriesFromFirestore, initializeCategoriesInFirestore } from "./services/categoryService";
import Shop from "./pages/Shop";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Review from "./pages/Review";
import AboutUs from "./pages/AboutUs";
import FloatingCart from "./components/FloatingCart";
import "./styles/global.css";

function usePaystack() {
  useEffect(() => {
    if (document.querySelector('script[src*="paystack"]')) return;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);
}

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const firestoreProducts = await getProductsFromFirestore();
        const seedIds = new Set(["p1", "p2", "p3", "p4", "p5", "p6"]);

        const filteredProducts = firestoreProducts
          .filter((p) => !seedIds.has(p.id))
          .map((p) => ({ ...p, bestSelling: p.bestSelling || false }));

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
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


function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        let firestoreCats = await getCategoriesFromFirestore();
        if (firestoreCats.length <= 1) {
            const initialCategories = ["Seating", "Tables", "Office", "Lighting", "Storage", "Bedroom", "Other"];
            await initializeCategoriesInFirestore(initialCategories);
            firestoreCats = await getCategoriesFromFirestore();
        }
        setCategories(firestoreCats);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([{ id: "other-id", name: "Other" }]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return [categories, setCategories, loading];
}

export default function App() {
  usePaystack();
  const [products, setProducts, productsLoading] = useProducts();
  const [categories, setCategories, categoriesLoading] = useCategories();
  const loading = productsLoading || categoriesLoading;
  const [view, setView] = useState("shop");
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
          categories={categories}
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
          categories={categories}
          onCategoriesChange={setCategories}
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

      <FloatingCart />
    </>
  );
}
