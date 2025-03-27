import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🛒 AsyncStorage'den sepeti yükle
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Sepet yüklenirken hata oluştu:", error);
      }
    };
    loadCart();
  }, []);

  // 📦 Sepet değiştiğinde AsyncStorage'e kaydet
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (cartItems.length > 0) {
          await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
          await AsyncStorage.removeItem('cart'); // Eğer sepet boşsa, kaydını silelim
        }
      } catch (error) {
        console.error("Sepet kaydedilirken hata oluştu:", error);
      }
    };
    saveCart();
  }, [cartItems]);

  // ➕ Ürün ekleme fonksiyonu
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingProductIndex > -1) {
        // Ürün zaten varsa, miktarını topla
        const updatedItems = [...prevItems];
        updatedItems[existingProductIndex].quantity += product.quantity;
        return updatedItems;
      } else {
        // Ürün yoksa, yeni ürün ekle
        return [...prevItems, { ...product }];
      }
    });
  };

  // ➕ Ürün miktarını güncelleme fonksiyonu
  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity };  // Miktarı güncelle
        }
        return item;
      });
      return updatedItems;
    });
  };

  // ❌ Ürün silme fonksiyonu
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // 🧹 Sepeti temizleme fonksiyonu
  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem('cart');
    } catch (error) {
      console.error("Sepet temizlenirken hata oluştu:", error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);