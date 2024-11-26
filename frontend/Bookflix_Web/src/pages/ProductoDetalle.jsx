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
  const [loading, setLoading] = useState(true);
  const [reseñas, setReseñas] = useState([]);
  const [textoReseña, setTextoReseña] = useState("");
  const [haReseñado, setHaReseñado] = useState(false);

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
        console.log("Producto cargado:", data);
        setProducto(data);
        setReseñas(data.reseñas || []);
        if (auth.usuario) {
          const usuarioHaReseñado = data.reseñas.some(
            (reseña) => reseña.usuario === auth.usuario.nombre
          );
          setHaReseñado(usuarioHaReseñado);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [productoId, auth.usuario]);

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
      if (!producto.idLibro) {
        console.error("El producto no tiene un idLibro definido:", producto);
        alert("Error: El producto no tiene un ID válido.");
        return;
      }
      agregarAlCarrito({
        libroId: producto.idLibro,
        cantidad: cantidad,
        nombreLibro: producto.nombre,
        subtotal: producto.precio * cantidad,
      });
      alert("Producto añadido al carrito");
    }
  };

  const handleCrearReseña = async () => {
    if (textoReseña.trim()) {
      try {
        const nuevaReseña = {
          texto: textoReseña,
          libroId: productoId,
          nombreUsuario: auth.usuario ? auth.usuario.nombre : "Anónimo", // Verificación de usuario
          fechaPublicacion: new Date().toISOString(), // Enviar la fecha en formato ISO
        };

        console.log("Payload being sent:", nuevaReseña); // Depuración: Muestra los datos enviados

        const response = await fetch(
          `https://localhost:7182/api/User/publicar`, // Asegúrate de que esta URL es correcta
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(nuevaReseña),
          }
        );

        console.log("Response status:", response.status); // Depuración: Muestra el estado de la respuesta
        console.log("Response headers:", response.headers); // Depuración: Muestra los encabezados de la respuesta

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText); // Depuración: Muestra el error del servidor
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        const data = await response.json();
        setReseñas((prevReseñas) => [
          {
            texto: textoReseña,
            usuario: data.nombreUsuario,
            fecha: data.fechaPublicacion,
          },
          ...prevReseñas,
        ]);
        setTextoReseña("");
        setHaReseñado(true);
      } catch (error) {
        console.error("Error al crear la reseña:", error);
      }
    } else {
      alert("Escribe una reseña antes de enviar");
    }
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!producto) {
    return <p>Producto no encontrado.</p>;
  }

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
        <hr />
        <div className="reseñas texto-pequeño">
          <h2 className="texto-grande">Reseñas</h2>
          {auth.usuario ? (
            <div className="crearReseña">
              <input
                className="textoReseñaNueva"
                value={textoReseña}
                onChange={(e) => setTextoReseña(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
                disabled={haReseñado} // Deshabilitar si ya ha reseñado
              />
              <button
                className="btnCrearReseña"
                onClick={handleCrearReseña}
                disabled={haReseñado} // Deshabilitar si ya ha reseñado
              >
                Crear
              </button>
            </div>
          ) : (
            <div className="crearReseña">
              <input
                className="textoReseñaNueva"
                placeholder="Inicia sesión para dejar tu reseña"
                disabled
              />
            </div>
          )}
          {reseñas.length > 0 ? (
            reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>Usuario: {reseña.usuario}</p>
                <p>Fecha: {new Date(reseña.fecha).toLocaleDateString()}</p>
                <p>{reseña.texto}</p>
              </div>
            ))
          ) : (
            <p>No hay reseñas para este producto.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;