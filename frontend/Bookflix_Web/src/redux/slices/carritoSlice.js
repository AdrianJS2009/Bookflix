import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch cart from backend for authenticated user
export const cargarCarrito = createAsyncThunk(
  "carrito/cargarCarrito",
  async (userId, { getState }) => {
    const { auth } = getState();
    const response = await fetch(
      `http://localhost:5000/api/Carrito/${userId}`,
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

// Async thunk to add an item to the backend cart for authenticated user
export const agregarAlCarritoBackend = createAsyncThunk(
  "carrito/agregarAlCarritoBackend",
  async ({ userId, item }, { getState }) => {
    const { auth } = getState();
    const response = await fetch(
      `http://localhost:5000/api/Carrito/${userId}/agregar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(item),
      }
    );
    if (!response.ok) throw new Error("Failed to add item to cart");
    return item;
  }
);

// Async thunk to remove an item from the backend cart for authenticated user
export const eliminarDelCarritoBackend = createAsyncThunk(
  "carrito/eliminarDelCarritoBackend",
  async ({ userId, libroId }, { getState }) => {
    const { auth } = getState();
    const response = await fetch(
      `http://localhost:5000/api/Carrito/${userId}/eliminar/${libroId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to remove item from cart");
    return libroId;
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
      const existingItem = state.items.find((i) => i.idLibro === item.idLibro);
      if (existingItem) {
        existingItem.cantidad += item.cantidad;
      } else {
        state.items.push(item);
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
    builder
      .addCase(cargarCarrito.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(agregarAlCarritoBackend.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.items.find(
          (i) => i.idLibro === item.idLibro
        );
        if (existingItem) {
          existingItem.cantidad += item.cantidad;
        } else {
          state.items.push(item);
        }
      })
      .addCase(eliminarDelCarritoBackend.fulfilled, (state, action) => {
        const libroId = action.payload;
        state.items = state.items.filter((item) => item.idLibro !== libroId);
      });
  },
});

export const {
  agregarAlCarritoLocal,
  limpiarCarrito,
  cargarCarritoDesdeLocalStorage,
} = carritoSlice.actions;

export default carritoSlice.reducer;
