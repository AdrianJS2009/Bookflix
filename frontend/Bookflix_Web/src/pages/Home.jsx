import Banner from "../components/Banner";
import Carrusel2 from "../components/Carrusel2";
import Generos from "../components/Generos";
import TopVentas from "../components/TopVentas";

import "../styles/default.css";
import "../styles/styles.css";

export default function Home() {
  return (
    <>
      <main className="home-bookflix fondo-blanco">
        <Banner
          imageSrc="/assets/banner/BannerUnete.png"
          altText="Banner Unete"
        />
        <Generos />
        <Banner
          imageSrc="/assets/banner/BannerEnvioGratuito.png"
          altText="Banner Envío Gratuito"
        />

        <Carrusel2 />
        <TopVentas />
        <Banner
          imageSrc="/assets/banner/BannerWebAmigas.png"
          altText="Banner Web Amigas"
        />
      </main>
    </>
  );
}
