import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/catalogo.css";
import "../styles/default.css";

const Catalogo = ({ productos }) => {
  const navigate = useNavigate(); // Usar useNavigate para redirección
  const [libros, setLibros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [precioOrden, setPrecioOrden] = useState("");
  const [alfabeticoOrden, setAlfabeticoOrden] = useState("Ascendente");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLibros = async (page) => {
    setIsLoading(true);
    setError(null);

    const ordenPor = precioOrden ? "precio" : "nombre"; // Define el campo de ordenación
    const ascendente = precioOrden
      ? precioOrden === "Ascendente"
      : alfabeticoOrden === "Ascendente"; // Define el orden ascendente o descendente

    try {
      // Construye la URL con los filtros aplicados
      let url = `http://localhost:5000/api/Libro/ListarLibros?pagina=${
        page + 1
      }&tamanoPagina=${itemsPerPage}`;
      if (nombre) url += `&textoBuscado=${encodeURIComponent(nombre)}`; // Filtro de búsqueda por nombre o autor
      if (genero) url += `&genero=${encodeURIComponent(genero)}`; // Filtro por género
      url += `&ordenPor=${ordenPor}&ascendente=${ascendente}`; // Añade el orden y el tipo de orden

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener libros desde el servidor");
      }

      const data = await response.json();
      setLibros(data.libros || []);
      setPageCount(data.totalPaginas || 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibros(currentPage);
  }, [currentPage, nombre, genero, precioOrden, alfabeticoOrden, itemsPerPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    const startItemIndex = currentPage * itemsPerPage;
    const newPage = Math.floor(startItemIndex / newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newPage);
  };

  const handleSearchInputChange = (event) => {
    setNombre(event.target.value);
    setCurrentPage(0);
  };

  const handleProductoClick = (id) => {
    navigate(`/producto/${id}`); // Redirige a la página de detalles
  };

  return (
    <>
      <Header />
      <div className="catalogo-container texto-pequeño">
        <h1>Catálogo</h1>
        <div className="catalogoBuscadorFiltros">
          <div className="catalogoBuscador">
            <input
              type="text"
              placeholder="Buscar por nombre o por autor"
              value={nombre}
              onChange={handleSearchInputChange}
              className="input-search"
            />
            <button onClick={() => fetchLibros(0)} className="btn-buscar">
              Buscar
            </button>
          </div>
          <div className="catalogoFiltros">

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
                setAlfabeticoOrden(""); // Resetea el orden alfabético al aplicar orden por precio
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
                setPrecioOrden(""); // Resetea el orden de precio al aplicar orden alfabético
              }}
              className="filtro-select"
            >
              <option value="Ascendente">Ordenar alfabéticamente (A-Z)</option>
              <option value="Descendente">Ordenar alfabéticamente (Z-A)</option>
            </select>
            
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="filtro-select"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={30}>30 por página</option>
            </select>
          </div>
        </div>
        <div className="catalogoBookflix"></div>
        {isLoading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="catalogoItems">
            {libros.map((libro) => (
              <div
                key={libro.idLibro}
                className="catalogoItem"
                onClick={() => handleProductoClick(libro.idLibro)} // Redirige a la página de detalles con el ID del libro
              >
                <div className="catalogoItemContent">
                  <img
                    src={libro.urlImagen}
                    alt={`Portada de ${libro.nombre}`}
                    className="imgItemCatalogo"
                  />
                </div>
                <div className="catalogoItemButtons">
                  <h2 className="titulo">{libro.nombre}</h2>
                  <p className="precio">{libro.autor}</p>
                  <p className="precio">{(libro.precio / 100).toFixed(2)} €</p>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Añadido a la cesta");
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="paginacion">
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Siguiente"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={currentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalogo;
