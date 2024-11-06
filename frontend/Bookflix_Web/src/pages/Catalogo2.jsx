import React, { useEffect, useState } from "react";
import "../styles/catalogo2.css";

const Catalogo = () => {
  const [libros, setLibros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [precioOrden, setPrecioOrden] = useState("");
  const [alfabeticoOrden, setAlfabeticoOrden] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLibros = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Base URL
      let url = `http://localhost:5000/api/Libro/ListarLibros?pagina=1&tamanoPagina=10`;

      // Añadir parámetros solo si tienen valor
      if (nombre) url += `&nombre=${encodeURIComponent(nombre)}`;
      if (genero) url += `&genero=${encodeURIComponent(genero)}`;
      if (precioOrden)
        url += `&ordenPor=precio&ascendente=${precioOrden === "Ascendente"}`;
      else if (alfabeticoOrden)
        url += `&ordenPor=nombre&ascendente=${
          alfabeticoOrden === "Ascendente"
        }`;

      console.log("URL de la solicitud:", url); // Para verificar la URL generada

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener libros desde el servidor");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data); // Imprimir la respuesta aquí
      setLibros(data);
    } catch (error) {
      setError(error.message);
      console.error("Error en fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar libros al montar el componente
  useEffect(() => {
    fetchLibros();
  }, []);

  return (
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
                <h2 className="titulo">{libro.nombre}</h2>
                <p className="precio">{libro.precio} €</p>
              </div>
              <div className="catalogoItemButtons">
                <button className="btn-comprar">Comprar</button>
                <button className="btn-anadir">Añadir a la cesta</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogo;
