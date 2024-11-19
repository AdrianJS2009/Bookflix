import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { selectUsuario } from "../redux/slices/authSlice";
import "../styles/ProductoDetalle.css";

const Carrito = () => {
  const { productoId } = useParams();
  const usuario = useSelector(selectUsuario);
  const [producto, setProducto] = useState(null);
  const [textoReseña, setTextoReseña] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const [comprados, setComprados] = useState([]);

  useEffect(() => {
    // Cargar datos del producto
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Libro/Detalle/${productoId}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del producto");
        }
        const data = await response.json();
        setProducto(data);
        setReseñas(data.reseñas || []);
      } catch (error) {
        console.error("Error al cargar el producto:", error.message);
      }
    };

    // Cargar productos comprados desde localStorage
    const productosComprados =
      JSON.parse(localStorage.getItem("comprados")) || [];
    setComprados(productosComprados);

  const eliminarItemCarrito = async (e, itemId) => {
    if (e.target) {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Carrito/${usuario.id}/eliminar/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (response.ok) {
          console.log("Item eliminado del carrito", data);
        } else {
          console.error("Error eliminando el artículo", data.error || data.message);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud", error);
      }
    }
  };
  
  
  const registrarCompra = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      navigate("/login");
      return;
    }

    const nuevosComprados = [
      ...comprados,
      { idLibro: parseInt(productoId), userId: usuario.id },
    ];
    localStorage.setItem("comprados", JSON.stringify(nuevosComprados));
    setComprados(nuevosComprados);

    alert("Producto marcado como comprado.");
  };

  const handleCrearReseña = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    const haComprado = comprados.some(
      (compra) =>
        compra.idLibro === parseInt(productoId) && compra.userId === usuario.id
    );

    if (!haComprado) {
      alert("Debes comprar este producto antes de dejar una reseña.");
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
              Authorization: `Bearer ${usuario.token}`, // Asegúrate de que el token esté disponible
            },
            body: JSON.stringify(nuevaReseña),
          }
        );

        if (!response.ok) {
          throw new Error("Error al enviar la reseña");
        }

        const data = await response.json();
        setReseñas([
          { texto: textoReseña, categoria: data.categoria },
          ...reseñas,
        ]);
        setTextoReseña("");
        alert("Reseña creada con éxito.");
      } catch (error) {
        console.error("Error al crear la reseña:", error.message);
        alert("Error al enviar la reseña.");
      }
    } else {
      alert("Escribe una reseña antes de enviar.");
    }
  };

  if (!producto) {
    return <p>Cargando...</p>;
  }

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
            <div key={index} className="carrito-item">
              <img
                src={item.urlImagen || "placeholder.jpg"}
                alt={`Portada de ${item.nombre || "undefined"}`}
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
              
              <button className="botonEliminar" onClick={(e) => eliminarItemCarrito(e, item.id)}>x</button>
            </div>
          ))}
        </div>
        
      </div>
    
    
  );
  </>
  );
};

export default Carrito;
