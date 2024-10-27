import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/default.css';
import '../styles/styles.css';

export default function Home() {
    const [indiceActual, setIndiceActual] = useState(0);
    
    const moverCarrusel = (direccion) => {
        const totalItems = 5; // Total de elementos en el carrusel
        let nuevoIndice = indiceActual + direccion;

        // Asegurar que el índice esté dentro de los límites
        if (nuevoIndice < 0) {
            nuevoIndice = totalItems - 1; // Regresar al último elemento
        } else if (nuevoIndice >= totalItems) {
            nuevoIndice = 0; // Regresar al primer elemento
        }

        setIndiceActual(nuevoIndice);
    };

    return (
        <>
            <Header />
            <div className='home-bookflix'>
                <div className='box-banner'>
                    <img src='/assets/banner/BannerUnete.png' alt="Banner Unete" />
                </div>

                <div className='generos-container'>
                    <div className='genero ciencia-ficcion'>
                        <a href=''><p className='texto-pequeño-bold'>Ciencia Ficción</p></a>
                    </div>
                    <div className='genero fantasia'>
                        <a href=''><p className='texto-pequeño-bold'>Fantasía</p></a>
                    </div>
                    <div className='genero terror'>
                        <a href=''><p className='texto-pequeño-bold'>Terror</p></a>
                    </div>
                    <div className='genero misterio'>
                        <a href=''><p className='texto-pequeño-bold'>Misterio</p></a>
                    </div>
                    <div className='genero thriller'>
                        <a href=''><p className='texto-pequeño-bold'>Thriller</p></a>
                    </div>
                    <div className='genero romance'>
                        <a href=''><p className='texto-pequeño-bold'>Romance</p></a>
                    </div>
                    <div className='genero biografia'>
                        <a href=''><p className='texto-pequeño-bold'>Biografía</p></a>
                    </div>
                    <div className='genero historicos'>
                        <a href=''><p className='texto-pequeño-bold'>Históricos</p></a>
                    </div>
                    <div className='genero cinefilos'>
                        <a href=''><p className='texto-pequeño-bold'>Cinéfilos</p></a>
                    </div>
                    <div className='genero novelas'>
                        <a href=''><p className='texto-pequeño-bold'>Novelas</p></a>
                    </div>
                </div>

                <div className='box-banner'>
                    <img src='/assets/banner/BannerEnvioGratuito.png' alt="Banner Envío Gratuito" />
                </div>

                <div className="carrusel-container">
                    <button className="flecha izquierda" onClick={() => moverCarrusel(-1)}>&#10094;</button>
                    <div id="carrusel" className="carrusel" style={{ transform: `translateX(-${indiceActual * 100}%)` }}>
                        <div className="carrusel-item">
                            <img src="/assets/libros/1.jpg" alt="Libro 1" />
                        </div>
                        <div className="carrusel-item">
                            <img src="/assets/libros/2.jpg" alt="Libro 2" />
                        </div>
                        <div className="carrusel-item">
                            <img src="/assets/libros/3.jpg" alt="Libro 3" />
                        </div>
                        <div className="carrusel-item">
                            <img src="/assets/libros/4.jpg" alt="Libro 4" />
                        </div>
                        <div className="carrusel-item">
                            <img src="/assets/libros/5.jpg" alt="Libro 5" />
                        </div>
                    </div>
                    <button className="flecha derecha" onClick={() => moverCarrusel(1)}>&#10095;</button>
                </div>

                <div className='box-banner'>
                    <img src='/assets/banner/BannerWebAmigas.png' alt="Banner Web Amigas" />
                </div>
            </div>
            <Footer />
        </>
    );
}