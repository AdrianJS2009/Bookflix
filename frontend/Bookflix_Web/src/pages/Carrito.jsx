import { useEffect } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { usuario, token } = useAuth();
  const { items, vaciarCarrito, eliminarItem, cargarCarrito } = useCarrito();

  useEffect(() => {
    if (usuario) {
      cargarCarrito(usuario.id);
    }
  }, [usuario, cargarCarrito]);

  const handleClearCart = () => {
    vaciarCarrito();
    alert("El carrito ha sido vaciado.");
  };

  const handleCompra = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/ListarCarrito?correo=${usuario.correo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error al registrar la compra: ${errorData.error || "Desconocido"}`
        );
        return;
      }

      alert("Compra registrada con éxito.");
      vaciarCarrito();
    } catch (error) {
      console.error("Error al registrar la compra:", error.message);
      alert("Error al registrar la compra. Intenta nuevamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="carrito-container texto-pequeño">
        <h1 className="texto-grande">Carrito de Compras</h1>
        {items.length === 0 ? (
          <p>No hay artículos en el carrito.</p>
        ) : (
          <div className="carrito-items">
            {items.map((item, index) => (
              <div key={item.productoId || index} className="carrito-item">
                <img
                  src={item.urlImagen || "placeholder.jpg"}
                  alt={`Portada de ${item.nombre || "Producto"}`}
                  className="imagenProducto"
                />
                <p>
                  <strong>{item.nombre || "Producto sin nombre"}</strong>
                </p>
                <p>
                  Precio:{" "}
                  {(item.precio / 100 || 0).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
                <p>Cantidad: {item.cantidad}</p>
                <button
                  className="botonEliminar"
                  onClick={() => eliminarItem(item.productoId)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        <Button
          label="Vaciar Carrito"
          styleType="btnDefault"
          className="botonVaciar"
          onClick={handleClearCart}
          disabled={items.length === 0}
        />
        {"  "}
        <Button
          label="Comprar"
          styleType="btnComprar"
          className="botonComprar"
          onClick={handleCompra}
          disabled={items.length === 0}
        />
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
