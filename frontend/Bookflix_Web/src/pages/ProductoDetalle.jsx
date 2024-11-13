import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/ProductoDetalle.css";
import { useAuth } from "../utils/AuthContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [producto, setProducto] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token y extraer el valor del campo "token"
    const storedToken = localStorage.getItem("token");
    const token = storedToken ? JSON.parse(storedToken).token : null;

    if (!token) {
      console.error(
        "Token no encontrado o inválido. Redirigiendo a registro..."
      );
      navigate("/registro"); // Redirigir a la página de registro si no hay token
      return;
    }

    // Cargar datos del producto
    fetch(`http://localhost:5000/api/Libro/Detalle/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token JWT extraído
        "Content-Type": "application/json",
      },
      cache: "no-store", // Desactiva la caché para evitar respuestas 304
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar el producto: ${response.status} ${response.statusText}`
          );
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Respuesta no es JSON");
        }
        return response.json();
      })
      .then((data) => setProducto(data.libro))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));

    // Verificar si el usuario ha comprado el producto
    if (user) {
      fetch(`/api/User/${user.id}/purchases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al verificar la compra del producto: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => setHasPurchased(data.hasPurchased))
        .catch((error) =>
          console.error("Error al verificar la compra del producto:", error)
        );
    }
  }, [id, user, navigate]);

  const handleAddToCart = () => {
    const newCartItem = { productId: id, quantity: cantidad };
    if (user) {
      fetch(`/api/user/${user.id}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCartItem),
      }).then(() => navigate("/carrito"));
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(newCartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const cambiarCantidad = (operacion) => {
    setCantidad((prevCantidad) => {
      if (operacion === 'incrementar') return prevCantidad + 1;
      if (operacion === 'decrementar' && prevCantidad > 1) return prevCantidad - 1;
      return prevCantidad;
    });
  };

  const handleReviewSubmit = (reviewText) => {
    fetch("/api/reviews/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: reviewText }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newReview = { text: reviewText, category: data.category };
        fetch(`/api/productos/${id}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        });
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
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
      <div className="productoDetalle">
        <p className="volverAtras texto-pequeño">
          <Link to="/catalogo">◄◄ Volver al catálogo</Link>
        </p>
        <div className="principal">
          <div className="imagenContainer">
            <img
              src={producto.urlImagen}
              alt={producto.nombre}
              className="imagen"
            />
          </div>
          <div className="info texto-mediano">
            <h1 className="texto-grande">{producto.nombre}</h1>
            <p className="autor">Autor: {producto.autor}</p>
            <p className="descripcion">
              Descripción: <br /> {producto.descripcion}
            </p>
            <p className="generoLibro">
              Género:{" "}
              <Link to={`/catalogo?genero=${producto.genero}`}>
                <span className="genero"> {producto.genero} </span>
              </Link>
            </p>
            <p className="isbn texto-pequeño">ISBN: {producto.isbn}</p>
          </div>
          <div className="detalles texto-mediano">
            <p className="precio">
              Precio: €{(producto.precio / 100).toFixed(2)}
            </p>
            <p className="stock">
              {producto.stock > 0 ? (
                <span>
                  <span className="existencias">⬤</span> En stock
                </span>
              ) : (
                <span>
                  <span className="agotado">⬤</span> Agotado
                </span>
              )}
            </p>

            <div className="cantidad">
              <button className="masCantidad" onClick={() => cambiarCantidad('decrementar')}>-</button>
              <input type="number" value={cantidad} readOnly />
              <button className="menosCantidad" onClick={() => cambiarCantidad('incrementar')}>+</button>
            </div>

            <p className="valoracion">
              Valoración Media: {producto.valoracionMedia || "N/A"}
            </p>
            <Button
              label="Comprar"
              styleType="btnComprar"
              onClick={(e) => {
                e.stopPropagation();
                alert("Compra realizada");
              }}
            />
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
          {producto.reseñas && producto.reseñas.length > 0 ? (
            producto.reseñas.map((reseña, index) => (
              <div key={index} className="reseña">
                <p>Autor: {reseña.autor}</p>
                <p>Estrellas: {"⭐".repeat(reseña.estrellas)}</p>
                <p>{reseña.texto}</p>
              </div>
            ))
          ) : (
            <p>No hay reseñas para este producto.</p>
          )}
        </div>
        {user && hasPurchased && (
          <section className="añadirReseña">
            <h3>Escribe tu reseña</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReviewSubmit(e.target.elements.reviewText.value);
              }}
            >
              <textarea name="reviewText" required />
              <button type="submit">Enviar reseña</button>
            </form>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
