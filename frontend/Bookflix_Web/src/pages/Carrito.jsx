import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { limpiarCarrito } from "../redux/slices/carritoSlice"; // Corrected import for `limpiarCarrito`

const Carrito = () => {
  const dispatch = useDispatch();
  const carritoItems = useSelector((state) => state.carrito.items);

  const handleClearCart = () => {
    dispatch(limpiarCarrito()); // Corrected usage of `limpiarCarrito`
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {carritoItems.length > 0 ? (
        <div>
          <ul>
            {carritoItems.map((item) => (
              <li key={item.idLibro}>
                {item.nombre} - Cantidad: {item.cantidad}
              </li>
            ))}
          </ul>
          <button onClick={handleClearCart}>Vaciar Carrito</button>
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
};

export default Carrito;
