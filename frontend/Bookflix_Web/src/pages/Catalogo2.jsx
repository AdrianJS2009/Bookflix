import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import "../styles/default.css";
import "../styles/catalogo 2.css";

function Catalogo2() {
    const [buscar, setBuscar] = useState("");
    const [rangoPrecio, setRangoPrecio] = useState([0, 100]);
    const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
    const [libros, setLibros] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [cargando, setCargando] = useState(false);

    const TAMANO_PAGINA = 9;

    // Hacer la petición a la API para obtener los libros
    const obtenerLibros = async () => {
        setCargando(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/libro/ListarLibros?nombre=${buscar}&precioMin=${rangoPrecio[0]}&precioMax=${rangoPrecio[1]}&genero=${generosSeleccionados.join(",")}&pagina=${pagina}&tamanoPagina=${TAMANO_PAGINA}`
            );
            const totalLibros = response.headers.get("totalLibros");
            const totalPaginas = response.headers.get("totalPaginas");
            // Obtener el cuerpo de la respuesta
            const data = await response.json();
    
            // Leer los encabezados de la respuesta para obtener totalPaginas y totalLibros
            
    
            // Establecer los valores en el estado
            setLibros(data);
            setTotalPaginas(Number(totalPaginas)); // Convertir a número
    
        } catch (error) {
            console.error("Error al obtener libros", error);
        }
        setCargando(false);
    };
    

    // Llamar a la API cuando cambia la página, los filtros o la búsqueda
    useEffect(() => {
        obtenerLibros();
    }, [buscar, rangoPrecio, generosSeleccionados, pagina]);

    const handleSearchChange = (event) => {
        setBuscar(event.target.value);
    };

    const handlePrecioChange = (event) => {
        const nuevoRango = [...rangoPrecio];
        nuevoRango[event.target.name === "min" ? 0 : 1] = Number(event.target.value);
        setRangoPrecio(nuevoRango);
    };

    const handleGeneroChange = (event) => {
        const genero = event.target.value;
        setGenerosSeleccionados((prev) =>
            prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
        );
    };

    const handleCambioPagina = (pagina) => {
        setPagina(pagina);
    };

    return (
        <>
            <Header />
            <div className="catalogoBookflix">
                <h1>Catálogo</h1>
                <div className="catalogo">
                    <div className="catalogoFiltro">
                        <h2>Filtros</h2>
                        <div className="buscador">
                            <input
                                type="text"
                                placeholder="Buscar libros..."
                                value={buscar}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="filtroPrecio">
                            <h3>Rango de Precio</h3>
                            <label>
                                Mínimo: {rangoPrecio[0]} €
                                <input
                                    type="range"
                                    name="min"
                                    min="0"
                                    max="100"
                                    value={rangoPrecio[0]}
                                    onChange={handlePrecioChange}
                                />
                            </label>
                            <label>
                                Máximo: {rangoPrecio[1]} €
                                <input
                                    type="range"
                                    name="max"
                                    min="0"
                                    max="100"
                                    value={rangoPrecio[1]}
                                    onChange={handlePrecioChange}
                                />
                            </label>
                        </div>

                        <div className="filtroGeneros">
                            <h3>Géneros</h3>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Romance"
                                    checked={generosSeleccionados.includes("Romance")}
                                    onChange={handleGeneroChange}
                                />
                                Romance
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Ficción"
                                    checked={generosSeleccionados.includes("Ficción")}
                                    onChange={handleGeneroChange}
                                />
                                Ficción
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Ciencia ficción"
                                    checked={generosSeleccionados.includes("Ciencia ficción")}
                                    onChange={handleGeneroChange}
                                />
                                Ciencia ficción
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="No ficción"
                                    checked={generosSeleccionados.includes("No ficción")}
                                    onChange={handleGeneroChange}
                                />
                                No ficción
                            </label>
                        </div>
                    </div>

                    <div className="catalogoItems">
                        {cargando ? (
                            <p>Cargando...</p>
                        ) : (
                            libros.map((libro) => (
                                <div className="catalogoItem" key={libro.id}>
                                    <div className="catalogoItemContent">
                                        <img
                                            src={libro.urlImagen}
                                            alt={`Portada de ${libro.nombre}`}
                                            className="imgItemCatalogo"
                                        />
                                    </div>
                                    <div className="catalogoItemButtons">
                                        <p className="titulo">{libro.nombre}</p>
                                        <p className="precio">{libro.precio} €</p>
                                        <Button label="Comprar" styleType="btnComprar" onClick={() => alert("Compra realizada")} />
                                        <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert("Añadido a la cesta")} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="paginacion">
                        <button
                            onClick={() => handleCambioPagina(pagina - 1)}
                            disabled={pagina === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {pagina} de {totalPaginas}</span>
                        <button
                            onClick={() => handleCambioPagina(pagina + 1)}
                            disabled={pagina === totalPaginas}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Catalogo2;
