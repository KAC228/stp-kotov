"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { CartItem, Product, ProductSize, ConfiguratorQuotePayload } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isOrderFormOpen: boolean;
  quoteDraft: ConfiguratorQuotePayload | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; size: ProductSize }
  | { type: "REMOVE_ITEM"; productId: string; sizeId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; sizeId: string; quantity: number }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "OPEN_ORDER_FORM" }
  | { type: "CLOSE_ORDER_FORM" }
  | { type: "CLEAR_CART" }
  | { type: "SET_QUOTE_DRAFT"; payload: ConfiguratorQuotePayload | null };

interface CartContextValue {
  state: CartState;
  addItem: (product: Product, size: ProductSize) => void;
  removeItem: (productId: string, sizeId: string) => void;
  updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  openOrderForm: () => void;
  openOrderFormWithQuote: (payload: ConfiguratorQuotePayload) => void;
  closeOrderForm: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.product.id &&
          item.selectedSize.id === action.size.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, selectedSize: action.size, quantity: 1 },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.productId &&
              item.selectedSize.id === action.sizeId
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === action.productId &&
                item.selectedSize.id === action.sizeId
              )
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId &&
          item.selectedSize.id === action.sizeId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "OPEN_ORDER_FORM":
      return { ...state, isOrderFormOpen: true };
    case "CLOSE_ORDER_FORM":
      return { ...state, isOrderFormOpen: false };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_QUOTE_DRAFT":
      return { ...state, quoteDraft: action.payload };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isOrderFormOpen: false,
  quoteDraft: null,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((product: Product, size: ProductSize) => {
    dispatch({ type: "ADD_ITEM", product, size });
  }, []);

  const removeItem = useCallback((productId: string, sizeId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId, sizeId });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, sizeId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", productId, sizeId, quantity });
    },
    []
  );

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const openOrderForm = useCallback(
    () => {
      dispatch({ type: "SET_QUOTE_DRAFT", payload: null });
      dispatch({ type: "OPEN_ORDER_FORM" });
    },
    []
  );
  const openOrderFormWithQuote = useCallback((payload: ConfiguratorQuotePayload) => {
    dispatch({ type: "SET_QUOTE_DRAFT", payload });
    dispatch({ type: "OPEN_ORDER_FORM" });
  }, []);
  const closeOrderForm = useCallback(
    () => {
      dispatch({ type: "CLOSE_ORDER_FORM" });
      dispatch({ type: "SET_QUOTE_DRAFT", payload: null });
    },
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) =>
      sum +
      (item.product.basePrice + item.selectedSize.priceModifier) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        openCart,
        closeCart,
        openOrderForm,
        openOrderFormWithQuote,
        closeOrderForm,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
