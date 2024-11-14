import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carritoReducer from "./slices/carritoSlice";

const store = configureStore({
  reducer: {
    carrito: carritoReducer,
    auth: authReducer,
  },
});

export default store;
