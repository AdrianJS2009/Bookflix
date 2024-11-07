import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import "../styles/catalogo.css";
import "../styles/styles.css"

const Catalogo = () => {
  const [libros, setLibros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [precioOrden, setPrecioOrden] = useState("");
  const [alfabeticoOrden, setAlfabeticoOrden] = useState("Ascendente");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLibros = async () => {
    setIsLoading(true);
    setError(null);

    // Determina los valores para `ordenPor` y `ascendente` basados en los filtros seleccionados
    const ordenPor = precioOrden ? "precio" : "nombre";
    const ascendente = precioOrden
      ? precioOrden === "Ascendente"
      : alfabeticoOrden === "Ascendente";

    try {
      // Construcción dinámica de la URL con los filtros aplicados
      let url = `http://localhost:5000/api/Libro/ListarLibros?pagina=1&tamanoPagina=9`;
      if (nombre) url += `&nombre=${encodeURIComponent(nombre)}`;
      if (genero) url += `&genero=${encodeURIComponent(genero)}`;
      url += `&ordenPor=${ordenPor}&ascendente=${ascendente}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener libros desde el servidor");
      }

      const data = await response.json();
      setLibros(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar libros al montar el componente
  useEffect(() => {
    fetchLibros();
  }, []);

  return (
    <>
    <Header />
      <div className="catalogo-container">
        <h1>Catálogo</h1>
        <div className="catalogoBookflix">
          <input
            type="text"
            placeholder="Buscar por nombre o por autor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-search"
          />
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los géneros</option>
            <option value="Literatura">Literatura</option>
            <option value="Autoayuda">Autoayuda</option>
            <option value="Referencia">Referencia</option>
            <option value="Ilustrado">Ilustrado</option>
            <option value="Historia">Historia</option>
            <option value="Emprendimiento">Emprendimiento</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Programación">Programación</option>
            <option value="Fantasía">Fantasía</option>
            <option value="Narrativa">Narrativa</option>
            <option value="Drama">Drama</option>
            <option value="Economía">Economía</option>
            <option value="Novela">Novela</option>
            <option value="Thriller">Thriller</option>
            <option value="Filosofía">Filosofía</option>
            <option value="Filosofía militar">Filosofía militar</option>
            <option value="No ficción">No ficción</option>
            <option value="Reflexión">Reflexión</option>
            <option value="Espiritualidad">Espiritualidad</option>
            <option value="Psicología">Psicología</option>
          </select>
          <select
            value={precioOrden}
            onChange={(e) => {
              setPrecioOrden(e.target.value);
              setAlfabeticoOrden("");
            }}
            className="filtro-select"
          >
            <option value="">Ordenar por precio</option>
            <option value="Ascendente">Ascendente</option>
            <option value="Descendente">Descendente</option>
          </select>
          <select
            value={alfabeticoOrden}
            onChange={(e) => {
              setAlfabeticoOrden(e.target.value);
              setPrecioOrden("");
            }}
            className="filtro-select"
          >
            <option value="Ascendente">Ordenar alfabéticamente (A-Z)</option>
            <option value="Descendente">Ordenar alfabéticamente (Z-A)</option>
          </select>
          <button onClick={fetchLibros} className="btn-buscar">
            Buscar
          </button>
        </div>
        {isLoading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="catalogoItems">
            {libros.map((libro) => (
              <div key={libro.idLibro} className="catalogoItem">
                <div className="catalogoItemContent">
                  <img
                    src={libro.urlImagen}
                    alt={`Portada de ${libro.nombre}`}
                    className="imgItemCatalogo"
                  />
                
                  <h2 className="titulo">{libro.nombre}</h2>
                  <p className="precio">{libro.precio} €</p>
                </div>
                <div className="catalogoItemButtons">
                <Button label="Comprar" styleType="btnComprar" onClick={() => alert("Compra realizada")} />
                <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert("Añadido a la cesta")} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Catalogo;
