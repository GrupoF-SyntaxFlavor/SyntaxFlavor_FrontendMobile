import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cartItems: Product[];
  menuItems: Product[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  setMenuItems: (items: Product[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([
    {
        id: 1,
        name: 'Onigiris de Atún',
        description: 'Deliciosos triángulos de arroz rellenos de atún fresco, sazonados con un toque de salsa de soya y envueltos en una capa de alga nori crujiente.',
        price: 25,
        image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg',
        quantity: 10
      },
      {
        id: 2,
        name: 'Cheesecake de Uvas',
        description: 'Un postre delicioso y fresco, perfecto para cualquier ocasión.',
        price: 30,
        image: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/vimdb/230649.jpg',
        quantity: 5
      },
      {
        id: 3,
        name: 'Tacos de Pollo',
        description: 'Tacos de pollo con guacamole y salsa de chipotle.',
        price: 40,
        image: 'https://www.vvsupremo.com/wp-content/uploads/2017/06/Chicken-Tacos-900x570-sRGB.jpg',
        quantity: 20
      },
      {
        id: 4,
        name: 'Pizza de Pepperoni',
        description: 'Pizza de pepperoni con queso mozzarella y salsa de tomate.',
        price: 50,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIoXjS-sXqWGIsMTB_m3av-Oh-Fgi93hBrzg&s',
        quantity: 8
      },
      {
        id: 5,
        name: 'Hamburguesa Clásica',
        description: 'Hamburguesa con carne de res, lechuga, tomate, cebolla y queso cheddar.',
        price: 35,
        image: 'https://img.freepik.com/fotos-premium/foto-stock-hamburguesa-clasica-aislada-blanco_940723-217.jpg',
        quantity: 15
      },
      {
        id: 6,
        name: 'Té Helado',
        description: 'Té helado de limón, perfecto para refrescarte en un día caluroso.',
        price: 15,
        image: 'https://imag.bonviveur.com/te-helado.jpg',
        quantity: 25
      },
      {
        id: 7,
        name: 'Pastel de Chocolate',
        description: 'Un pastel de chocolate esponjoso y delicioso, perfecto para los amantes del chocolate.',
        price: 30,
        image: 'https://i.pinimg.com/736x/42/36/b1/4236b10d070cb898106d84a6f2fa4a2c.jpg',
        quantity: 12
      }
    ]);

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
    <CartContext.Provider value={{ cartItems, menuItems, addToCart, updateQuantity, removeFromCart, setMenuItems }}>
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