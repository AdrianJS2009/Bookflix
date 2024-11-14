import { createSlice } from "@reduxjs/toolkit";

const cargarEstadoInicial = () => {
  const carrito = localStorage.getItem("carrito");
  return carrito ? JSON.parse(carrito) : [];
};

// Slice controlador del carrito
const carritoSlice = createSlice({
  name: "carrito",
  initialState: {
    productos: cargarEstadoInicial(),
  },
  reducers: {
    agregarProducto: (state, action) => {
      const producto = action.payload;
      const productoExistente = state.productos.find(
        (p) => p.id === producto.id
      );

      if (productoExistente) {
        if (productoExistente.cantidad < producto.stock) {
          productoExistente.cantidad += 1;
        }
      } else {
        state.productos.push({ ...producto, cantidad: 1 });
      }
      localStorage.setItem("carrito", JSON.stringify(state.productos));
    },
    removerProducto: (state, action) => {
      const productoId = action.payload;
      state.productos = state.productos.filter((p) => p.id !== productoId);
      localStorage.setItem("carrito", JSON.stringify(state.productos));
    },
    vaciarCarrito: (state) => {
      state.productos = [];
      localStorage.removeItem("carrito");
    },
  },
});

export const { agregarProducto, removerProducto, vaciarCarrito } =
  carritoSlice.actions;
export default carritoSlice.reducer;
