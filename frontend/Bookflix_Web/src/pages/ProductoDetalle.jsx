import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const { auth } = useAuth();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Libro/Detalle/${productoId}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar el producto.");
        }
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
      }
    };

    cargarProducto();
  }, [productoId]);

  const manejarCambio = (e) => {
    const nuevoValor = e.target.value;
    setCantidad(nuevoValor);
  };

  const manejarBlur = () => {
    const cantidadInt = parseInt(cantidad, 10);
    if (!isNaN(cantidadInt)) {
      setCantidad(Math.min(Math.max(cantidadInt, 1), producto?.stock || 1));
    }
  };

  const cambiarCantidad = (accion) => {
    setCantidad((prevCantidad) => {
      if (accion === "incrementar") {
        return Math.min(prevCantidad + 1, producto.stock);
      } else if (accion === "decrementar") {
        return Math.max(prevCantidad - 1, 1);
      }
      return prevCantidad;
    });
  };

  const handleAddToCart = () => {
    if (!auth.usuario) {
      alert("Inicia sesión para añadir productos al carrito.");
    } else if (producto && cantidad > 0 && cantidad <= producto.stock) {
      agregarAlCarrito({
        productoId: producto.idLibro,
        cantidad,
        nombre: producto.nombre,
        precio: producto.precio,
        urlImagen: producto.urlImagen,
      });
      alert("Producto añadido al carrito");
    }
  };

  if (error) return <p>{error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  return (
    <>
      <Header />
      <div className="detalle-contenido">
        <p className="volverAtras texto-pequeño">
          <Link to="/catalogo">◄◄ Volver al catálogo</Link>
        </p>
        <div className="principal">
          <div className="imagenContainer">
            <img
              src={producto.urlImagen || "placeholder.jpg"}
              alt={producto.nombre || "Producto desconocido"}
              className="imagen"
            />
          </div>
          <div className="info texto-mediano">
            <h1 className="texto-grande">{producto.nombre || "Sin nombre"}</h1>
            <p className="autor">Autor: {producto.autor || "Desconocido"}</p>
            <p className="descripcion">
              Descripción: <br /> {producto.descripcion || "No disponible"}
            </p>
            <p className="generoLibro">
              Género:{" "}
              <Link to={`/catalogo?genero=${producto.genero}`}>
                <span className="genero">
                  {producto.genero || "Sin género"}
                </span>
              </Link>
            </p>
            <p className="isbn texto-pequeño">ISBN: {producto.isbn || "N/A"}</p>
          </div>
          <div className="detalles texto-mediano">
            <p className="precio">
              Precio: {(producto.precio / 100).toFixed(2)} €
            </p>
            <p className="stock">
              {producto.stock > 0 ? (
                <span>
                  <span className="existencias">⬤</span> En stock <br />
                  <span>Actualmente quedan {producto.stock}</span>
                </span>
              ) : (
                <span>
                  <span className="agotado">⬤</span> Agotado
                </span>
              )}
            </p>
            <div className="cantidad">
              <button
                className="masCantidad"
                onClick={() => cambiarCantidad("decrementar")}
              >
                -
              </button>
              <input
                type="text"
                value={cantidad}
                onChange={manejarCambio}
                onBlur={manejarBlur}
              />
              <button
                className="menosCantidad"
                onClick={() => cambiarCantidad("incrementar")}
              >
                +
              </button>
            </div>
            <Button
              label="Añadir a la cesta"
              styleType="btnAñadir"
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
