import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { selectToken, selectUsuario } from "../redux/slices/authSlice";
import { agregarAlCarritoLocal } from "../redux/slices/carritoSlice";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usuario = useSelector(selectUsuario);
  const token = useSelector(selectToken);

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [textoReseña, setTextoReseña] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Libro/Detalle/${productoId}`
        );
        if (!response.ok) throw new Error("Error al cargar los detalles del producto");
        const data = await response.json();
        setProducto(data);
        setReseñas(data.reseñas || []);
      } catch (error) {
        setError(error.message);
      }
    };

  //   const checkPurchaseStatus = async () => {
  //     if (usuario && token) {
  //       try {
  //         const response = await fetch(
  //           `https://localhost:7182/api/Carrito/${usuario.id}/checkPurchase/${productoId}`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         if (response.ok) {
  //           const result = await response.json();
  //           setHasPurchased(result.hasPurchased);
  //         }
  //       } catch (error) {
  //         console.error("Error al verificar el estado de compra:", error);
  //       }
  //     }
  //   };
  //   checkPurchaseStatus();
    fetchProducto();
  }, [productoId, usuario, token]);

  const manejarCambio = (e) => {
    const nuevoValor = parseInt(e.target.value, 10);
    
    if (!isNaN(nuevoValor) && nuevoValor >= 1) {
      if (nuevoValor > producto.stock) {
        setCantidad(producto.stock);
      } else {
        setCantidad(nuevoValor);
      }
    } else {
      setCantidad(1);
    }
  };
  
  const cambiarCantidad = (accion) => {
    setCantidad((prevCantidad) => {
      if (accion === "incrementar") {
        if (prevCantidad < producto.stock) {
          return prevCantidad + 1;
        } else {
          return prevCantidad;
        }
      } else if (accion === "decrementar") {
        if (prevCantidad > 1) {
          return prevCantidad - 1;
        }
      }
      return prevCantidad;
    });
  };

  const handleAddToCart = () => {
    if (producto && (cantidad > 0 && cantidad <= producto.sto1)) {
      dispatch(agregarAlCarritoLocal({
        productoId: producto.idLibro,
        cantidad,
        nombre: producto.nombre,
        precio: producto.precio,
        urlImagen: producto.urlImagen,
      }));
      alert("Producto añadido al carrito");
    }
  };

  const registrarCompra = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7182/api/Carrito/${usuario.id}/comprar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error al registrar la compra: ${errorData.error}`);
        return;
      }

      alert("Compra registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar la compra:", error.message);
      alert("Error al registrar la compra. Intenta nuevamente.");
    }
  };

  const handleCrearReseña = async () => {
    if (!usuario || !hasPurchased) {
      alert("Debes haber iniciado sesión y comprado el producto para dejar una reseña.");
      navigate("/login");
      return;
    }

    if (textoReseña.trim()) {
      try {
        const nuevaReseña = {
          texto: textoReseña,
          libroId: productoId,
        };

        const response = await fetch(
          `https://localhost:7182/api/Libro/publicarReseña`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaReseña),
          }
        );

        if (!response.ok) throw new Error("Error al enviar la reseña");

        const data = await response.json();
        setReseñas([{ texto: textoReseña, categoria: data.categoria }, ...reseñas]);
        setTextoReseña("");
      } catch (error) {
        console.error("Error al crear la reseña:", error);
      }
    } else {
      alert("Escribe una reseña antes de enviar");
    }
  };

  if (error) return <p>{error}</p>;
  if (!producto) return <p>Cargando...</p>;

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
            <p className="descripcion">Descripción: <br /> {producto.descripcion || "No disponible"}</p>
            <p className="generoLibro">
              Género:{" "}
              <Link to={`/catalogo?genero=${producto.genero}`}>
                <span className="genero">{producto.genero || "Sin género"}</span>
              </Link>
            </p>
            <p className="isbn texto-pequeño">ISBN: {producto.isbn || "N/A"}</p>
          </div>
          <div className="detalles texto-mediano">
            <p className="precio">Precio: {(producto.precio / 100).toFixed(2)} €</p>
            <p className="stock">
              {producto.stock > 0 ? (
                <span><span className="existencias">⬤</span> En stock <br />
                  <span>Actualmente quedan {producto.stock}</span></span>
              ) : (
                <span><span className="agotado">⬤</span> Agotado</span>
              )}
            </p>
            <div className="cantidad">
            <button className="masCantidad" onClick={() => cambiarCantidad("decrementar")}>-</button>
            <input 
              type="text" 
              value={cantidad} 
              onChange={manejarCambio} // Permite cambiar la cantidad escribiendo
            />
            <button className="menosCantidad" onClick={() => cambiarCantidad("incrementar")}>+</button>
            </div>
            <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={handleAddToCart} data-id={producto.idLibro} />
          </div>
        </div>
        <hr />
        <div className="reseñas texto-pequeño">
          <h2 className="texto-grande">Reseñas</h2>
          <div className="crearReseña">
            <textarea
              className="textoReseñaNueva"
              value={textoReseña}
              onChange={(e) => setTextoReseña(e.target.value)}
              placeholder="Escribe tu reseña aquí..."
            />
            <Button label="Crear" styleType="btnCrearReseña" onClick={handleCrearReseña} />
          </div>
          {reseñas.length > 0 ? (
            reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>Texto: {reseña.texto} - Categoría: {reseña.categoria}</p>
              </div>
            ))
          ) : (
            <p className="sin-reviews">No hay reseñas para este producto.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
