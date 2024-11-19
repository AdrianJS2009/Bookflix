import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { selectUsuario } from "../redux/slices/authSlice";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
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

    fetchProducto();
  }, [productoId]);

  const handleComprar = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para comprar este producto.");
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
    <div className="producto-detalle">
      <h1>{producto.nombre || "Sin título"}</h1>
      <p>{producto.descripcion || "Descripción no disponible."}</p>
      <p>
        Precio:{" "}
        {(producto.precio / 100).toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </p>
      <Button label="Comprar" onClick={handleComprar} />
      <div className="reseñas">
        <h2>Reseñas</h2>
        <div>
          <textarea
            value={textoReseña}
            onChange={(e) => setTextoReseña(e.target.value)}
            placeholder="Escribe tu reseña aquí..."
          />
          <Button label="Enviar Reseña" onClick={handleCrearReseña} />
        </div>
        <div>
          {reseñas.length > 0 ? (
            reseñas.map((reseña, index) => (
              <div key={index}>
                <p>
                  <strong>Texto:</strong> {reseña.texto}
                </p>
                <p>
                  <strong>Categoría:</strong> {reseña.categoria}
                </p>
              </div>
            ))
          ) : (
            <p>No hay reseñas para este producto.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
