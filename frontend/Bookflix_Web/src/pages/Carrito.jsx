import { useEffect } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { items, vaciarCarrito, eliminarItem } = useCarrito();
  const { auth } = useAuth();

  const handleCompra = () => {
    if (!auth.usuario) {
      alert("Inicia sesión para realizar la compra");
    } else {
      alert("Compra realizada con éxito");
      vaciarCarrito();
    }
  };

  const handleEliminarItem = (libroId) => {
    eliminarItem(libroId);
  };

  useEffect(() => {
    console.log("Carrito actualizado", items);
  }, [items]);

  return (
    <div className="carrito-container">
      <Header />
      <main>
        <h1 className="texto-grande">Carrito de compras</h1>
        {items.length === 0 ? (
          <p className="texto-pequeño">Tu carrito está vacío.</p>
        ) : (
          <ul className="carrito-lista">
            {items.map((item, index) => (
              <li key={index} className="carrito-item">
                <img
                  src={item.urlImagen || "placeholder.jpg"}
                  alt={`Portada de ${item.nombreLibro || "Producto"}`}
                  className="imagenProducto"
                />
                <div className="carrito-item-info">
                  <p>
                    <strong>{item.nombreLibro || "Producto sin nombre"}</strong>
                  </p>
                  <p>
                    Precio unitario:{" "}
                    {(item.precio / 100).toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>
                    Subtotal:{" "}
                    {((item.precio * item.cantidad) / 100).toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
                <button
                  className="botonEliminar"
                  onClick={() => handleEliminarItem(item.libroId)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button
          label="Vaciar Carrito"
          styleType="btnDefault"
          className="botonVaciar"
          onClick={vaciarCarrito}
        />
        <Button
          label="Comprar"
          styleType="btnDefault"
          className="botonComprar"
          onClick={handleCompra}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;