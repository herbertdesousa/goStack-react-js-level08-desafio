import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cart = await AsyncStorage.getItem('@cart');

      if (cart !== null) {
        const cartParsed = JSON.parse(cart);
        setProducts(cartParsed);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    const cartDatas = await AsyncStorage.getItem('@cart');

    if (cartDatas != null) {
      const cartParsed = JSON.parse(cartDatas);

      const isSameProductExists = cartParsed.find(
        currentProduct => currentProduct.id === product.id,
      );

      if (isSameProductExists) {
        const newCart = cartParsed.filter(currentProduct => {
          if (currentProduct.id === isSameProductExists.id) {
            return (currentProduct.quantity += 1);
          }
          return currentProduct;
        });

        await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
        setProducts(newCart);
      } else {
        const newCart = [...cartParsed, { ...product, quantity: 1 }];

        await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
        setProducts(newCart);
      }
    } else {
      const newCart = [{ ...product, quantity: 1 }];
      await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
      setProducts(newCart);
    }
  }, []);

  const increment = useCallback(async id => {
    const cartDatas = await AsyncStorage.getItem('@cart');

    if (cartDatas != null) {
      const cartParsed = JSON.parse(cartDatas);

      const isSameProductExists = cartParsed.find(
        currentProduct => currentProduct.id === id,
      );

      if (isSameProductExists) {
        const newCart = cartParsed.filter(currentProduct => {
          if (currentProduct.id === isSameProductExists.id) {
            return (currentProduct.quantity += 1);
          }
          return currentProduct;
        });

        await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
        setProducts(newCart);
      }
    }
  }, []);

  const decrement = useCallback(async id => {
    const cartDatas = await AsyncStorage.getItem('@cart');

    if (cartDatas != null) {
      const cartParsed = JSON.parse(cartDatas);

      const isSameProductExists = cartParsed.find(
        currentProduct => currentProduct.id === id,
      );

      if (isSameProductExists) {
        const newCart = cartParsed.filter(currentProduct => {
          if (currentProduct.id === isSameProductExists.id) {
            return (currentProduct.quantity -= 1);
          }
          return currentProduct;
        });

        await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
        setProducts(newCart);
      }
    }
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
