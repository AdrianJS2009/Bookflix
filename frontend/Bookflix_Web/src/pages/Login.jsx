import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/default.css';
import '../styles/styles.css';

export default function Login() {
    return (
        <>
            <Header />
            <div className='home-bookflix'>
                <div className='box-banner'>
                    <img src='/assets/banner/BannerUnete.png' alt="Banner Unete" />
                </div>
                {/* Aquí puedes agregar más contenido para la página de Login */}
                <div className='login-form'>
                    <h1>Iniciar Sesión</h1>
                    <form>
                        <div>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" required />
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" required />
                        </div>
                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
