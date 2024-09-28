import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '../models/Product';
import { PastOrder } from '@/models/PastOrder';

interface CartContextProps {
  cartItems: Product[];
  menuItems: Product[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  setMenuItems: (items: Product[]) => void;
  setCartItems: (items: Product[]) => void; // Añadido
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cartItems');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);

          // Sincronizar el estado del menú con el carrito
          setMenuItems((prevMenuItems) =>
            prevMenuItems.map((menuItem) => {
              const cartItem = parsedCart.find((item: Product) => item.id === menuItem.id);
              if (cartItem) {
                return { ...menuItem, quantity: menuItem.quantity - cartItem.quantity };
              }
              return menuItem;
            })
          );
        }
      } catch (error) {
        console.error('Failed to load cart from storage', error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }
    };

    saveCart();

    const clearCartAfterOneHour = setTimeout(() => {
      console.log('Clearing cart after 1 hour for testing purposes');
      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((menuItem) => {
          const cartItem = cartItems.find((item) => item.id === menuItem.id);
          if (cartItem) {
            return { ...menuItem, quantity: menuItem.quantity + cartItem.quantity };
          }
          return menuItem;
        })
      );
      setCartItems([]);
      AsyncStorage.removeItem('cartItems');
    }, 3600000); // 1 hora

    return () => clearTimeout(clearCartAfterOneHour);
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    setMenuItems((prevItems) =>
      prevItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );

    setMenuItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - delta } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    const productToRemove = cartItems.find(item => item.id === id);
    if (productToRemove) {
      setMenuItems((prevItems) =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + productToRemove.quantity } : item
        )
      );
      setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, menuItems, addToCart, updateQuantity, removeFromCart, setMenuItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};