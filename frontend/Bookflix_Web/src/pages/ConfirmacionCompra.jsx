import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import "../styles/ConfirmacionCompra.css";

const ConfirmacionCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total } = location.state || { items: [], total: 0 };

  const handleDescargarLibro = (nombreLibro) => {
    toast.success(`Descargando el libro: ${nombreLibro}`);
  };

  const handleVolverAlCatalogo = () => {
    navigate("/catalogo");
    console.log(items)
  };

  const totalPrecio = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0

  );
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <main className="confirmacion-compra-container">
      <h1 className="texto-grande">Confirmación de Compra</h1>
      <p className="texto-mediano">¡Gracias por tu compra!</p>
      <p className="texto-mediano">Detalles de la compra:</p>
      <ul className="lista-productos">
        {items.map((item, index) => (
          <Link to={`/producto/${item.idLibro}`}>
            <li key={index} className="producto texto-pequeño">
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
          </Link>
        ))}
      </ul>
      <p className="texto-mediano">Total: {(totalPrecio / 100).toFixed(2)} €</p>
      <p className="texto-mediano">Total de Ítems: {totalItems}</p>
      <Button
        label="Volver al catálogo"
        onClick={handleVolverAlCatalogo}
        styleType="btnVolver"
      />
    </main>
  );
};

export default ConfirmacionCompra;
