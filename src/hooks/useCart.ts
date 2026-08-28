import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  addItem as addItemAction,
  updateQuantity as updateQuantityAction,
  removeItem as removeItemAction,
  clearCart as clearCartAction,
} from "@/lib/store/cartSlice";
import { Product } from "@/types/product/product.types";
import { useCallback, useMemo } from "react";

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      dispatch(addItemAction({ product, quantity }));
    },
    [dispatch],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      dispatch(updateQuantityAction({ id, quantity }));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeItemAction(id));
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
      0,
    );
  }, [items]);

  return {
    items,
    ready: true,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
  };
}

export default useCart;
