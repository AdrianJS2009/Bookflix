import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { items, vaciarCarrito, eliminarItem } = useCarrito();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const cartCount = Array.isArray(items)
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  const subtotal = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    : 0;

  const handleCompra = async () => {
    if (!auth.token) {
      alert("Inicia sesión para realizar la compra");
      return;
    }

    try {
      // Sincronizar carrito con el backend antes de comprar
      console.log(
        "Sincronizando el carrito con el backend antes de la compra..."
      );
      for (const item of items) {
        const response = await fetch(
          "https://localhost:7182/api/Carrito/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
              LibroId: item.libroId,
              Cantidad: item.cantidad,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            `Error al sincronizar el producto con ID ${item.libroId}:`,
            errorData
          );
          alert(
            `Error al sincronizar el carrito: ${
              errorData.error || "Desconocido"
            }`
          );
          return;
        }
      }

      // Llamada al endpoint `ComprarCarrito`
      console.log("Realizando la compra...");
      const response = await fetch(
        "https://localhost:7182/api/Carrito/comprar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error al realizar la compra: ${errorData.error || "Desconocido"}`
        );
        return;
      }

      const responseData = await response.json();
      console.log("Compra realizada:", responseData);

      alert("Compra realizada con éxito");

      // Vaciar el carrito y navegar a la confirmación
      vaciarCarrito();
      const total = items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
      navigate("/confirmacion-compra", { state: { items, total } });
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Ocurrió un error al realizar la compra. Inténtalo nuevamente.");
    }
  };
  const handleEliminarItem = (libroId) => {
    eliminarItem(libroId);
  };

  return (
    <main className="carrito-container texto-pequeño">
      <h1 className="texto-grande">Carrito de compras</h1>
      {items.length === 0 ? (
        <p className="texto-pequeño">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {items.map((item, index) => {
              console.log("Item en carrito:", item);
              return (
                <li key={index} className="carrito-item">
                  <img
                    src={item.urlImagen || "placeholder.jpg"}
                    alt={`Imagen de ${item.nombre || "Producto"}`}
                    className="imagen-carrito"
                  />
                  <p>{item.nombre || "Sin nombre"}</p>
                  <div className="cantidad">
                    <button
                      className="masCantidad"
                      onClick={() => cambiarCantidad("decrementar")}
                    >
                      -
                    </button>
                    <input 
                      className="cantidadBox"
                      type="text"
                      value={item.cantidad}
                      // onChange={manejarCambio}
                      // onBlur={manejarBlur}
                    />
                    <button
                      className="menosCantidad"
                      onClick={() => cambiarCantidad("incrementar")}
                    >
                      +
                    </button>
                  </div>
                  <p>Precio: {(item.precio / 100).toFixed(2)} €</p>
                  <p>
                    Subtotal: {((item.precio * item.cantidad) / 100).toFixed(2)}{" "}
                    €
                  </p>
                  <button
                    className="botonEliminar"
                    onClick={() => handleEliminarItem(item.libroId)}
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="resumen-carrito">
            <p>
              <strong>Total de ítems:</strong> {cartCount}
            </p>
            <p>
              <strong className="texto-azul">Subtotal:</strong>{" "}
              <span className="precio-negro">
                {(subtotal / 100).toFixed(2)} €
              </span>
            </p>
          </div>
        </>
      )}
      <Button
        label="Vaciar Carrito"
        className="botonVaciar"
        onClick={vaciarCarrito}
      />
      <Button label="Comprar" className="botonComprar" onClick={handleCompra} />
    </main>
  );
};

export default Carrito;
