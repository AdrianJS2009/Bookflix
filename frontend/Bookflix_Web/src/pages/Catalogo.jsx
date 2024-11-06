import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

import "../styles/default.css";
import "../styles/catalogo.css";

function Catalogo() {
    const [searchTerm, setSearchTerm] = useState("");
    const [genre, setGenre] = useState("");
    const [priceOrder, setPriceOrder] = useState("");
    const [alphaOrder, setAlphaOrder] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    };

    const handlePriceOrderChange = (event) => {
        setPriceOrder(event.target.value);
    };

    const handleAlphaOrderChange = (event) => {
        setAlphaOrder(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Lógica para manejar la búsqueda
        console.log("Buscando:", searchTerm, genre, priceOrder, alphaOrder);
        // Aquí puedes añadir la lógica para filtrar los libros por nombre o autor
    };

    return (
        <>
            <Header />
            
            <div className="catalogoBookflix">
                <h1>Catálogo</h1>
                <form className="search-bar" onSubmit={handleSearchSubmit}>
    <div className="search-input-container">
        <input
            type="text"
            placeholder="Buscar por nombre o por autor"
            value={searchTerm}
            onChange={handleSearchChange}
        />
        <button type="submit">Buscar</button>
    </div>
    <div className="filters">
        <select value={genre} onChange={handleGenreChange}>
            <option value="">Todos los géneros</option>
            <option value="fiction">Ciencia Ficción</option>
            <option value="non-fiction">Terror</option>
            <option value="fantasy">Fantasía</option>
            <option value="mystery">Misterio</option>
            <option value="thriller">Thriller</option>
            <option value="romance">Romance</option>
            <option value="biographies">Biografías</option>
            <option value="historical">Históricos</option>
            <option value="scientific">Científicos</option>
            <option value="novels">Novelas</option>
        </select>
        <select value={priceOrder} onChange={handlePriceOrderChange}>
            <option value="">Ordenar por precio</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
        </select>
        <select value={alphaOrder} onChange={handleAlphaOrderChange}>
            <option value="">Ordenar alfabéticamente</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
        </select>
    </div>
</form>
                <div className="catalogo">
                    <div className="catalogoFiltro">

                    </div>
                    <div className="catalogoItems">
                        <div className="catalogoItem">
                            <div className="catalogoItemContent">
                                <img src="/assets/libros/1.png" className="imgItemCatalogo" />
                                <p className="titulo">Señorita feliz</p>
                                <p className="precio">10,50 €</p>
                            </div>
                            <div className="catalogoItemButtons">
                                <Button label="Comprar" styleType="btnComprar" onClick={() => alert("Compra realizada")} />
                                <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert("Añadido a la cesta")} />
                            </div>
                        </div>
                        {/* Otros elementos del catálogo */}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Catalogo;