"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartLineItem, Product } from "@/types/catalogue";
import { getEffectivePrice, calculateCartSubtotal } from "@/lib/pricing/format";
import { trackAddToCart, trackRemoveFromCart, trackViewCart } from "@/lib/analytics";

export interface CartContextValue {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isHydrated: boolean;
  addItem: (product: Product, selectedColor: string, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "rajishine_shopping_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartLineItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors on corrupt storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, isHydrated]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return calculateCartSubtotal(items);
  }, [items]);

  const addItem = (product: Product, selectedColor: string, quantity = 1) => {
    const variant = product.variants.find(
      (v) => v.color.toLowerCase() === selectedColor.toLowerCase()
    );

    const maxStock = variant ? variant.quantity : 0;
    if (maxStock <= 0) {
      return {
        success: false,
        message: `Sorry, ${product.productName} in ${selectedColor} is currently sold out.`,
      };
    }

    const lineId = `${product.productId}:::${selectedColor}`;
    const effectiveUnitPrice = getEffectivePrice(product.productPrice, product.discountedPrice);
    const primaryImg = variant?.primaryImage || product.primaryImage;

    let updatedCart: CartLineItem[] = [];
    let addedItem: CartLineItem | null = null;
    let didCap = false;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.lineId === lineId);

      if (existingIdx > -1) {
        const existing = prev[existingIdx];
        const newQty = existing.quantity + quantity;

        if (newQty > maxStock) {
          didCap = true;
          const cappedQty = maxStock;
          updatedCart = [...prev];
          updatedCart[existingIdx] = {
            ...existing,
            quantity: cappedQty,
            unitPrice: effectiveUnitPrice,
            originalPrice: product.discountedPrice ? product.productPrice : undefined,
            maxAvailableStock: maxStock,
          };
          addedItem = updatedCart[existingIdx];
          return updatedCart;
        }

        updatedCart = [...prev];
        updatedCart[existingIdx] = {
          ...existing,
          quantity: newQty,
          unitPrice: effectiveUnitPrice,
          originalPrice: product.discountedPrice ? product.productPrice : undefined,
          maxAvailableStock: maxStock,
        };
        addedItem = updatedCart[existingIdx];
        return updatedCart;
      } else {
        const initialQty = Math.min(quantity, maxStock);
        if (initialQty < quantity) {
          didCap = true;
        }

        const newItem: CartLineItem = {
          lineId,
          productId: product.productId,
          productName: product.productName,
          color: selectedColor,
          unitPrice: effectiveUnitPrice,
          originalPrice: product.discountedPrice ? product.productPrice : undefined,
          quantity: initialQty,
          image: primaryImg,
          maxAvailableStock: maxStock,
          category: product.category,
        };

        addedItem = newItem;
        updatedCart = [...prev, newItem];
        return updatedCart;
      }
    });

    if (addedItem) {
      trackAddToCart(addedItem);
    }

    setIsCartOpen(true);

    return {
      success: true,
      message: didCap
        ? `Added to cart (maximum available stock of ${maxStock} units applied).`
        : `Added ${product.productName} (${selectedColor}) to your cart.`,
    };
  };

  const updateQuantity = (lineId: string, requestedQty: number) => {
    if (requestedQty <= 0) {
      removeItem(lineId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.lineId === lineId) {
          const clampedQty = Math.min(requestedQty, item.maxAvailableStock);
          return {
            ...item,
            quantity: clampedQty,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (lineId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.lineId === lineId);
      if (target) {
        trackRemoveFromCart(target);
      }
      return prev.filter((i) => i.lineId !== lineId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
    trackViewCart(items, subtotal);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        isHydrated,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
