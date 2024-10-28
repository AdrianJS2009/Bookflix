import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Carrusel from '../components/Carrusel';

import '../styles/default.css';
import '../styles/styles.css';


export default function Home() {
    return (
        <>
            <Header />
            <div className='home-bookflix fondo-blanco'>
                <div className='box-banner'>
                    <img src='/assets/banner/BannerUnete.png' alt="Banner Unete" />
                </div>

                <section id="generos" href="generos">
                    <div className='generos-container'>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero ciencia-ficcion'>
                                <p>Ciencia Ficción</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero fantasia'>
                                <p>Fantasía</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                        <div className='genero terror'>
                            <p>Terror</p>
                        </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero misterio'>
                                <p>Misterio</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero thriller'>
                                <p>Thriller</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero romance'>
                                <p>Romance</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero biografia'>
                                <p>Biografía</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero historicos'>
                                <p>Históricos</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero cinefilos'>
                                <p>Cinéfilos</p>
                            </div>
                        </a>
                        <a href='' className='texto-mediano-bold texto-blanco'>
                            <div className='genero novelas'>
                                <p>Novelas</p>
                            </div>
                        </a>
                    </div>
                </section>

                <div className='box-banner'>
                    <img src='/assets/banner/BannerEnvioGratuito.png' alt="Banner Envío Gratuito" />
                </div>

                <section  id="novedades" href="novedades">
                    <Carrusel />
                </section>
                
                <section id="top-ventas" className="top-ventas-section">
                    <div className="libro">
                        <img src="/assets/libros/1.png" className="libro-imagen" />
                        <img src="/assets/numeros/1.png" className="puesto-imagen" />
                    </div>
                    <div className="libro">
                        <img src="/assets/libros/2.png" className="libro-imagen" />
                        <img src="/assets/numeros/2.png" className="puesto-imagen" />
                    </div>
                    <div className="libro">
                        <img src="/assets/libros/3.png" className="libro-imagen" />
                        <img src="/assets/numeros/3.png" className="puesto-imagen" />
                    </div>
                </section>


                <div className='box-banner'>
                    <img src='/assets/banner/BannerWebAmigas.png' alt="Banner Web Amigas" />
                </div>
            </div>
            <Footer />
        </>
    );
}