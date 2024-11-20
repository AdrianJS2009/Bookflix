import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const selectCarritoItems = (state) => state.carrito.items;

export const cargarCarrito = createAsyncThunk(
  "carrito/cargarCarrito",
  async (userId, { getState }) => {
    const { auth } = getState();
    const response = await fetch(
      `https://localhost:7182/api/Carrito/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to load cart");
    return await response.json();
  }
);

const initialState = {
  items: [],
};

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    agregarAlCarritoLocal: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i.idLibro === item.productoId
      );
      if (existingItem) {
        existingItem.cantidad += item.cantidad;
      } else {
        state.items.push({ ...item, idLibro: item.productoId });
      }
      localStorage.setItem("carrito", JSON.stringify(state.items));
    },
    limpiarCarrito: (state) => {
      state.items = [];
      localStorage.removeItem("carrito");
    },
    cargarCarritoDesdeLocalStorage: (state) => {
      const carritoLocal = JSON.parse(localStorage.getItem("carrito"));
      if (carritoLocal) {
        state.items = carritoLocal;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cargarCarrito.fulfilled, (state, action) => {
      state.items = action.payload;
      localStorage.setItem("carrito", JSON.stringify(state.items));
    });
  },
});

export const {
  agregarAlCarritoLocal,
  limpiarCarrito,
  cargarCarritoDesdeLocalStorage,
} = carritoSlice.actions;

export default carritoSlice.reducer;
