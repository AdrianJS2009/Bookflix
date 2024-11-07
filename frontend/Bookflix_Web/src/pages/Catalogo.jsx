import React, { useEffect, useState } from "react";
import "../styles/catalogo.css";

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
      const params = new URLSearchParams({
        nombre: nombre || undefined,
        genero: genero || undefined,
        ordenPor: precioOrden || alfabeticoOrden || undefined,
        ascendente: (precioOrden || alfabeticoOrden) === "Ascendente",
      });

      const response = await fetch(
        `http://localhost:5000/api/Libro/ListarLibros?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Error fetching books");
      }

      const data = await response.json();
      setLibros(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibros();
  }, [nombre, genero, precioOrden, alfabeticoOrden]);

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
          <option value="Ciencia Ficción">Ciencia Ficción</option>
          <option value="Terror">Terror</option>
          {/* Más géneros */}
        </select>
        <select
          value={precioOrden}
          onChange={(e) => setPrecioOrden(e.target.value)}
          className="filtro-select"
        >
          <option value="">Ordenar por precio</option>
          <option value="Ascendente">Ascendente</option>
          <option value="Descendente">Descendente</option>
        </select>
        <select
          value={alfabeticoOrden}
          onChange={(e) => setAlfabeticoOrden(e.target.value)}
          className="filtro-select"
        >
          <option value="">Ordenar alfabéticamente</option>
          <option value="Ascendente">Ascendente</option>
          <option value="Descendente">Descendente</option>
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
            <div key={libro.id} className="catalogoItem">
              <div className="catalogoItemContent">
                <h2 className="titulo">{libro.nombre}</h2>
                <p className="precio">{libro.precio} €</p>
                {/* Otros detalles del libro */}
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
