import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";

import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const { auth } = useAuth();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reseñas, setReseñas] = useState([]);
  const [textoReseña, setTextoReseña] = useState("");
  const [haReseñado, setHaReseñado] = useState(false);
  const [haComprado, setHaComprado] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const cargarProducto = async () => {
      console.log("Recargando datos del producto tras compra.");
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
        if (auth.token) {
          const usuarioHaReseñado = data.reseñas.some(
            (reseña) => reseña.usuario === auth.token.nombre
          );
          setHaReseñado(usuarioHaReseñado);

          const responseCompra = await fetch(
            `https://localhost:7182/api/Compra/Usuario/${auth.token.nombre}/Producto/${productoId}`
          );
          if (responseCompra.ok) {
            const dataCompra = await responseCompra.json();
            setHaComprado(dataCompra.haComprado);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [productoId, auth.token]);

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

  const handleAgregar = () => {
    if (producto && cantidad > 0 && cantidad <= producto.stock) {
      console.log("Producto antes de agregar:", producto);
      console.log("Cantidad seleccionada:", cantidad);

      agregarAlCarrito(
        {
          idLibro: producto.idLibro,
          nombre: producto.nombre,
          precio: producto.precio,
          urlImagen: producto.urlImagen,
        },
        cantidad
      );
    } else {
      console.warn("No se puede agregar al carrito: datos inválidos.", {
        producto,
        cantidad,
      });
    }
  };

  const handleCrearReseña = async () => {
    if (!auth.token) {
      toast.error("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    if (!haComprado) {
      toast.error("Debes comprar el producto para dejar una reseña.");
      return;
    }

    if (textoReseña.trim()) {
      try {
        const nuevaReseña = {
          texto: textoReseña,
          idLibro: productoId,
        };

        console.log("Payload being sent:", nuevaReseña);

        const response = await fetch(
          `https://localhost:7182/api/User/publicar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(nuevaReseña),
          }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText);
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
        toast.success("¡Gracias por tu opinión!.");
      } catch (error) {
        toast.error(error.message || "No se ha podido crear la reseña.");
      }
    } else {
      toast.warn("Tienes que escribir algo para enviar una reseña.");
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
      <main className="detalle-contenido">
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
              onClick={handleAgregar}
            />
          </div>
        </div>
        <hr />
        <div className="reseñas texto-pequeño">
          <h2 className="texto-grande">Reseñas</h2>
          {auth.token ? (
            <div className="crearReseña">
              <input
                className="textoReseñaNueva"
                value={textoReseña}
                onChange={(e) => setTextoReseña(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
                disabled={haReseñado || !haComprado}
              />
              <button
                className="btnCrearReseña"
                onClick={handleCrearReseña}
                disabled={haReseñado || !haComprado}
              >
                Crear
              </button>
            </div>
          ) : (
            <div className="crearReseña sinSesion">
              <p className="texto-mediano">
                Si quieres dejar tu reseña,{" "}
                <button
                  className="btnLogin"
                  onClick={() =>
                    navigate("/login", { state: { from: location } })
                  }
                >
                  Iniciar Sesión
                </button>
                .
              </p>
            </div>
          )}
          {reseñas.length > 0 ? (
            reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>Usuario: {reseña.autor}</p>
                <p>Fecha: {new Date(reseña.fecha).toLocaleDateString()}</p>
                <p>{reseña.texto}</p>
              </div>
            ))
          ) : (
            <p>No hay reseñas para este producto.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductoDetalle;