import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../components/styles/ConfirmacionCompra.css";

const ConfirmacionCompra = () => {
    const location = useLocation();
    const { items, total } = location.state || { items: [], total: 0 };
  
    return (
      <div className="confirmacion-compra-container">
        <h1 className="texto-grande">Confirmación de Compra</h1>
        <p className="texto-mediano">¡Gracias por tu compra!</p>
        <p className="texto-mediano">Detalles de la compra:</p>
        <ul className="lista-productos">
          {items.map((item, index) => (
            <li key={index} className="producto">
              <img src={item.urlImagen || "placeholder.jpg"} alt={item.nombreLibro} className="imagen-producto" />
              <p>Producto: {item.nombreLibro}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio: {(item.precio / 100).toFixed(2)} €</p>
              <p>Subtotal: {((item.precio * item.cantidad) / 100).toFixed(2)} €</p>
            </li>
          ))}
        </ul>
        <p className="texto-mediano">Total: {(total / 100).toFixed(2)} €</p>
        <Link to="/catalogo" className="btnVolver">Volver al catálogo</Link>
      </div>
    );
  };
  
  export default ConfirmacionCompra;