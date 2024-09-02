import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import userReducer from "../features/users/userSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    users: userReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});
