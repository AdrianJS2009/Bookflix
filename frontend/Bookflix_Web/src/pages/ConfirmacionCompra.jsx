import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../components/styles/ConfirmacionCompra.css";

const ConfirmacionCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total } = location.state || { items: [], total: 0 };

  const handleDescargarLibro = (nombreLibro) => {
    alert(`Descargando el libro: ${nombreLibro}`);
  };

  const handleVolverAlCatalogo = () => {
    navigate("/catalogo");
  };

  return (
    <div className="confirmacion-compra-container">
      <h1 className="texto-grande">Confirmación de Compra</h1>
      <p className="texto-mediano">¡Gracias por tu compra!</p>
      <p className="texto-mediano">Detalles de la compra:</p>
      <ul className="lista-productos">
        {items.map((item, index) => (
          <li key={index} className="producto">
            <img
              src={item.urlImagen || "placeholder.jpg"}
              alt={item.nombreLibro}
              className="imagen-producto"
            />
            <div className="detalles-producto">
              <p>
                <strong>Producto:</strong> {item.nombreLibro}
              </p>
              <p>
                <strong>Cantidad:</strong> {item.cantidad}
              </p>
              <p>
                <strong>Precio:</strong> {(item.precio / 100).toFixed(2)} €
              </p>
              <p>
                <strong>Subtotal:</strong>{" "}
                {((item.precio * item.cantidad) / 100).toFixed(2)} €
              </p>
            </div>
            <Button
              label="Descargar Libro"
              onClick={() => handleDescargarLibro(item.nombreLibro)}
              styleType="btnDescargar"
            />
          </li>
        ))}
      </ul>
      <p className="texto-mediano">Total: {(total / 100).toFixed(2)} €</p>
      <Button
        label="Volver al catálogo"
        onClick={handleVolverAlCatalogo}
        styleType="btnVolver"
      />
    </div>
  );
};

export default ConfirmacionCompra;
