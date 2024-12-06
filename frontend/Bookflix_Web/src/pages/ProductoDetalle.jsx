import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Libro/Detalle/${productoId}`
        );
        const data = await response.json();
        setProducto(data);
        setReseñas(data.reseñas || []);

        if (auth.token) {
          const usuarioHaReseñado = data.reseñas.some(
            (reseña) => reseña.autor === auth.nombre
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
  }, [productoId, auth.token]);

  useEffect(() => {
    const verificarCompra = async () => {
      if (auth.token) {
        try {
          const decoded = JSON.parse(atob(auth.token.split(".")[1]));
          const currentUser = parseInt(
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
          );
          const response = await fetch(
            `https://localhost:7182/api/User/verificar-compra?idUsuario=${currentUser}&idLibro=${productoId}`
          );
          if (response.ok) {
            setHaComprado(true);
          } else {
            setHaComprado(false);
          }
        } catch (err) {
          console.error("Error al verificar compra", err);
          setHaComprado(false);
        }
      }
    };

    verificarCompra();
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

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!producto) {
    return <p>Producto no encontrado.</p>;
  }

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
          (reseña) => reseña.usuario === auth.token
        );
        setHaReseñado(usuarioHaReseñado);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearReseña = async () => {
    if (textoReseña.trim()) {
      try {
        const nuevaReseña = {
          texto: textoReseña,
          idLibro: productoId,
          estrellas: parseInt(rating),
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

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText);
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        const data = await response.json();
        toast.success("¡Gracias por tu opinión!");

        cargarProducto();
        setTextoReseña("");
        setHaReseñado(true);
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
              <span className="genero">{producto.genero || "Sin género"}</span>
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
            haComprado ? (
              <div className="crearReseña">
                <input
                  className="textoReseñaNueva"
                  value={textoReseña}
                  onChange={(e) => setTextoReseña(e.target.value)}
                  placeholder="Escribe tu reseña aquí..."
                  disabled={haReseñado}
                />

                <Rating
                  className="reviewEstrellas"
                  name="reseña-rating"
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                  disabled={haReseñado}
                  precision={1}
                />

                <button
                  className="btnCrearReseña"
                  onClick={handleCrearReseña}
                  disabled={haReseñado}
                >
                  Crear
                </button>
              </div>
            ) : (
              <div className="crearReseña sinCompra">
                <p className="texto-mediano">
                  Debes comprar el producto para poder reseñar.
                </p>
              </div>
            )
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
                <p>
                  Fecha:{" "}
                  {new Date(reseña.fechaPublicacion).toLocaleDateString()}
                </p>
                <Rating value={reseña.estrellas} readOnly />
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
