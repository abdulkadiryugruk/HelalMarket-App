import React, { createContext, useState, useContext } from 'react';

// 1️⃣ Context oluştur
const CartContext = createContext();

// 2️⃣ Sağlayıcı bileşen oluştur
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Sepetteki ürünler

  // Sepete ürün ekleme fonksiyonu
  const addToCart = (product, quantity) => {
    const newItem = { ...product, quantity: parseInt(quantity) };
    setCartItems([...cartItems, newItem]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 3️⃣ Kullanımı kolaylaştırmak için özel bir hook
export const useCart = () => useContext(CartContext);
