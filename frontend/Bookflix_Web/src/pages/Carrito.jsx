import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/carrito.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Carrito = () => {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const {
    items = [],
    vaciarCarrito,
    vaciarCarritoLocal,
    eliminarItem,
    actualizarCantidad,
  } = useCarrito();
  const { auth } = useAuth();
  const navigate = useNavigate();

  if (!Array.isArray(items)) {
    console.error("Items en el carrito no es un array:", items);
    return <p>Hubo un error al cargar el carrito.</p>;
  }

  const cartCount = items.reduce((total, item) => total + item.cantidad, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const handleCompra = async () => {
    if (!auth.token) {
      toast.error("Inicia sesión para realizar la compra");
      return;
    }

    try {
      // console.log("Obteniendo datos más recientes del carrito...");
      const response = await fetch(
        `${baseURL}/api/Carrito/ListarCarrito`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Error al obtener el carrito: ${errorData.error || "Desconocido"}`
        );
        return;
      }

      const carrito = await response.json();
      if (!carrito.items || carrito.items.length === 0) {
        toast.error("Tu carrito está vacío");
        return;
      }

      // console.log("Realizando la compra...");
      const compraResponse = await fetch(
        `${baseURL}/api/Carrito/comprar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (!compraResponse.ok) {
        const errorData = await compraResponse.json();
        toast.error(
          `Error al realizar la compra: ${errorData.error || "Desconocido"}`
        );
        return;
      }
      toast.success("Compra realizada con éxito");
      vaciarCarrito();
      navigate("/confirmacion-compra", { state: { items: carrito.items } });
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      toast.error("Ocurrió un error al realizar la compra. Inténtalo nuevamente.");
    }
  };

  const handleEliminarItem = (idLibro) => {
    eliminarItem(idLibro);
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
              // console.log("Item en carrito:", item);
              return (
                <li key={index} className="carrito-item">
                  <img
                    src={item.urlImagen || "placeholder.jpg"}
                    alt={`Imagen de ${item.nombre || "Producto"}`}
                    className="imagen-carrito"
                  />
                  <Link to={`/producto/${item.idLibro}`}>
                    <p>{item.nombre || "Sin nombre"}</p>
                  </Link>
                  <div className="cantidad">
                    <button
                      className="masCantidad"
                      onClick={() =>
                        actualizarCantidad(item.idLibro, item.cantidad - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      className="cantidadBox"
                      type="text"
                      value={item.cantidad}
                      readOnly
                    />
                    <button
                      className="menosCantidad"
                      onClick={() =>
                        actualizarCantidad(item.idLibro, item.cantidad + 1)
                      }
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
                    onClick={() => handleEliminarItem(item.idLibro)}
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
        onClick={auth.token ? vaciarCarrito : vaciarCarritoLocal}
      />
      <Button label="Comprar" className="botonComprar" onClick={handleCompra} />
    </main>
  );
};

export default Carrito;
