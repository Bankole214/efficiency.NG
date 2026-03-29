import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const AnalyticsContext = createContext(null);

// Analytics data structure:
// {
//   totalRevenue: number,
//   totalOrders: number,
//   totalVisits: number,
//   itemSales: { [itemId]: { name, category, quantity, revenue } },
//   categorySales: { [category]: { quantity, revenue } },
//   orders: [{ date, items, total, customerName }]
// }

export function AnalyticsProvider({ children }) {
  const [analytics, setAnalytics] = useState(() => {
    try {
      const stored = localStorage.getItem("furni_analytics");
      return stored
        ? JSON.parse(stored)
        : {
            totalRevenue: 0,
            totalOrders: 0,
            totalVisits: 0,
            itemSales: {},
            categorySales: {},
            orders: [],
          };
    } catch {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalVisits: 0,
        itemSales: {},
        categorySales: {},
        orders: [],
      };
    }
  });

  // Save to localStorage whenever analytics change
  useEffect(() => {
    try {
      localStorage.setItem("furni_analytics", JSON.stringify(analytics));
    } catch (error) {
      console.error("Failed to save analytics:", error);
    }
  }, [analytics]);

  const trackPurchase = (cartItems, customerInfo) => {
    const orderTotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0,
    );
    const orderDate = new Date().toISOString();

    const order = {
      date: orderDate,
      items: cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.qty,
      })),
      total: orderTotal,
      customerName: customerInfo.name,
    };

    setAnalytics((prev) => {
      const newAnalytics = { ...prev };

      // Update totals
      newAnalytics.totalRevenue += orderTotal;
      newAnalytics.totalOrders += 1;

      // Update item sales
      cartItems.forEach((item) => {
        const itemId = item.product.id;
        if (!newAnalytics.itemSales[itemId]) {
          newAnalytics.itemSales[itemId] = {
            name: item.product.name,
            category: item.product.category,
            quantity: 0,
            revenue: 0,
          };
        }
        newAnalytics.itemSales[itemId].quantity += item.qty;
        newAnalytics.itemSales[itemId].revenue += item.product.price * item.qty;
      });

      // Update category sales
      cartItems.forEach((item) => {
        const category = item.product.category;
        if (!newAnalytics.categorySales[category]) {
          newAnalytics.categorySales[category] = {
            quantity: 0,
            revenue: 0,
          };
        }
        newAnalytics.categorySales[category].quantity += item.qty;
        newAnalytics.categorySales[category].revenue +=
          item.product.price * item.qty;
      });

      // Add order to history
      newAnalytics.orders.push(order);

      return newAnalytics;
    });
  };

  const trackVisit = useCallback(() => {
    setAnalytics((prev) => ({ ...prev, totalVisits: prev.totalVisits + 1 }));
  }, []);

  const clearAnalytics = () => {
    setAnalytics({
      totalRevenue: 0,
      totalOrders: 0,
      totalVisits: 0,
      itemSales: {},
      categorySales: {},
      orders: [],
    });
  };

  const resetVisits = () => {
    setAnalytics((prev) => ({ ...prev, totalVisits: 0 }));
  };

  // Calculate analytics
  const getBestSellingItem = () => {
    const items = Object.values(analytics.itemSales);
    if (items.length === 0) return null;
    return items.reduce((best, current) =>
      current.quantity > best.quantity ? current : best,
    );
  };

  const getBestSellingCategory = () => {
    const categories = Object.values(analytics.categorySales);
    if (categories.length === 0) return null;
    return categories.reduce((best, current) =>
      current.revenue > best.revenue ? current : best,
    );
  };

  const getTopItems = (limit = 5) => {
    return Object.values(analytics.itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  };

  const getTopCategories = (limit = 5) => {
    return Object.entries(analytics.categorySales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  };

  // Computed analytics for the UI
  const computedAnalytics = useMemo(
    () => ({
      totalRevenue: analytics.totalRevenue,
      totalSales: analytics.totalOrders,
      totalVisits: analytics.totalVisits,
      averageOrderValue:
        analytics.totalOrders > 0
          ? analytics.totalRevenue / analytics.totalOrders
          : 0,
      bestSellingProducts: Object.entries(analytics.itemSales)
        .map(([id, data]) => ({
          id,
          name: data.name,
          category: data.category,
          sales: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.sales - a.sales),
      revenueByCategory: Object.entries(analytics.categorySales)
        .map(([category, data]) => ({
          category,
          sales: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue),
    }),
    [analytics],
  );

  return (
    <AnalyticsContext.Provider
      value={{
        analytics: computedAnalytics,
        trackPurchase,
        trackVisit,
        clearAnalytics,
        resetVisits,
        getBestSellingItem,
        getBestSellingCategory,
        getTopItems,
        getTopCategories,
      }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
