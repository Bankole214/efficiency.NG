import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === product.id);
      if (existing) {
        toast.success(`Added another ${product.name} to cart`);
        return c.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...c, { product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((c) =>
      c
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        showCart,
        setShowCart,
        addToCart,
        updateQty,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
