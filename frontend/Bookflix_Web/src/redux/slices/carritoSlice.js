import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

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

      const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;
      storage.setItem("carrito", JSON.stringify(state.items));
    },
    limpiarCarrito: (state) => {
      state.items = [];
      const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;
      storage.removeItem("carrito");
    },
    cargarCarritoDesdeStorage: (state) => {
      const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;
      const carritoData = JSON.parse(storage.getItem("carrito"));
      if (carritoData) {
        state.items = carritoData;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cargarCarrito.fulfilled, (state, action) => {
      state.items = action.payload;
      sessionStorage.setItem("carrito", JSON.stringify(state.items));
    });
  },
});

export const {
  agregarAlCarritoLocal,
  limpiarCarrito,
  cargarCarritoDesdeStorage,
} = carritoSlice.actions;

export default carritoSlice.reducer;
