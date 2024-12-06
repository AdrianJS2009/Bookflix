import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useCarrito } from "../contexts/CarritoContext";
import "../styles/ProductoDetalle.css";
import "../styles/catalogo.css";
import "../styles/catalogoQuerys.css";
import "../styles/default.css";

const Catalogo = () => {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [libros, setLibros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [precioOrden, setPrecioOrden] = useState("");
  const [alfabeticoOrden, setAlfabeticoOrden] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cantidad, setCantidad] = useState(1);

  const fetchLibros = async (page) => {
    setIsLoading(true);
    setError(null);

    let ordenarPor = "";
    let ascendente = true;

    if (precioOrden) {
      ordenarPor = "precio";
      ascendente = precioOrden === "Ascendente";
    } else if (alfabeticoOrden) {
      ordenarPor = "nombre";
      ascendente = alfabeticoOrden === "Ascendente";
    }

    try {
      let url = `https://localhost:7182/api/Libro/ListarLibros?pagina=${page + 1
        }&tamanoPagina=${itemsPerPage}`;
      if (nombre) url += `&textoBusqueda=${encodeURIComponent(nombre)}`;
      if (genero) url += `&genero=${encodeURIComponent(genero)}`;
      if (ordenarPor)
        url += `&ordenarPor=${ordenarPor}&ascendente=${ascendente}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener libros desde el servidor");
      }

      const data = await response.json();
      console.log("Respuesta recibida:", data);

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
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
    fetchLibros(0);
  };

  const handleSearchInputChange = (event) => {
    setNombre(event.target.value);
    setCurrentPage(0);
  };

  const handleProductoClick = (id) => {
    navigate(`/producto/${id}`);
  };

  const handleAgregar = (libro) => {
    if (libro && cantidad > 0 && cantidad <= libro.stock) {
      console.log("libro antes de agregar:", libro);
      console.log("Cantidad seleccionada:", cantidad);

      agregarAlCarrito(
        {
          idLibro: libro.idLibro,
          nombre: libro.nombre,
          precio: libro.precio,
          urlImagen: libro.urlImagen,
        },
        cantidad
      );
    } else {
      console.warn("No se puede agregar al carrito: datos inválidos.", {
        libro,
        cantidad,
      });
    }
  };

  return (
    <>
      <main className="catalogo-container texto-pequeño">
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
              <option value="">Ordenar alfabéticamente</option>
              <option value="Ascendente">A-Z</option>
              <option value="Descendente">Z-A</option>
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
              >
                <div className="catalogoItemContent">
                  <img
                    src={libro.urlImagen}
                    alt={`Portada de ${libro.nombre}`}
                    className="imgItemCatalogo"
                  />
                </div>
                <div
                  className="catalogoItemButtons"
                  onClick={() => handleProductoClick(libro.idLibro)}
                >
                  <h2 className="titulo">
                    {Array.from(libro.nombre).length > 10
                      ? Array.from(libro.nombre).slice(0, 50).join("") + "..."
                      : libro.nombre}
                  </h2>
                  <p className="precio">{libro.autor}</p>
                  <p className="precio">{(libro.precio / 100).toFixed(2)} €</p>
                  <p className="precio">
                    {libro.stock > 0 ? (
                      <span>
                        <span className="existencias">⬤</span> En stock
                      </span>
                    ) : (
                      <span>
                        <span className="agotado">⬤</span> Agotado
                      </span>
                    )} - ⭐{libro.promedioEstrellas}
                  </p>
                </div>
                <Button
                  label="Añadir a la cesta"
                  styleType="btnAñadir"
                  onClick={() => handleAgregar(libro)}
                />
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
      </main>
    </>
  );
};

export default Catalogo;
