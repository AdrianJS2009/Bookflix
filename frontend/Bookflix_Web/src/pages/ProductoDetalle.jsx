import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { selectUsuario } from "../redux/slices/authSlice";
import "../styles/ProductoDetalle.css";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const usuario = useSelector(selectUsuario);

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [textoReseña, setTextoReseña] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const [comprados, setComprados] = useState([]);

  useEffect(() => {
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
        setError(error.message);
      }
    };

    const cargarComprados = () => {
      const productosComprados =
        JSON.parse(localStorage.getItem("comprados")) || [];
      setComprados(productosComprados);
    };

    fetchProducto();
    cargarComprados();
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
          texto: textoReseña, // Asegúrate de que coincida con el nombre en el DTO del backend
          productoId: parseInt(productoId, 10),
        };

        const response = await fetch(
          `https://localhost:7182/api/Libro/publicarResena`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuario.token}`,
            },
            body: JSON.stringify(nuevaReseña),
          }
        );

        if (!response.ok) {
          throw new Error("Error al enviar la reseña");
        }

        const data = await response.json(); // Aquí la IA asigna la categoría
        setReseñas([
          { texto: textoReseña, categoria: data.categoria },
          ...reseñas,
        ]);
        setTextoReseña("");
        alert("Reseña creada con éxito y categorizada por IA.");
      } catch (error) {
        console.error("Error al crear la reseña:", error.message);
        alert("Error al enviar la reseña.");
      }
    } else {
      alert("Escribe una reseña antes de enviar.");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!producto) {
    return <p>Cargando...</p>;
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
            <Button
              label="Comprar"
              styleType="btnComprar"
              onClick={handleComprar}
            />
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
            <Button
              label="Crear"
              styleType="btnCrearReseña"
              onClick={handleCrearReseña}
            />
          </div>
          {reseñas.length > 0 ? (
            reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>
                  Texto: {reseña.texto} - Categoría: {reseña.categoria}
                </p>
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
