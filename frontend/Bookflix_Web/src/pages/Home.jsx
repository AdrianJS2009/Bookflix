import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Carrusel from '../components/Carrusel';
import Generos from '../components/Generos';

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
                    <Generos />
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