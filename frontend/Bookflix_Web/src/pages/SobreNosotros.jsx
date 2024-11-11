import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/sobrenosotros.css";

function SobreNosotros() {
  return (
    <>
      <Header />
      <div className="sobrenosotros-container">
        <section className="team-section">
          <h2>Sobre Nosotros</h2>
          <div className="team-members">
            <div className="team-member">
              <img src="/assets/nosotros/elias.png" alt="Elias Robles" />
              <h3>Elias Robles</h3>
              <p>
                Estudiante de Desarrollo de Aplicaciones Web, técnico en
                Sistemas Microinformáticos y Redes, y gestión de CRMs.
              </p>
              <p>
                <strong>Roles principales:</strong>
              </p>
              <ul>
                <li>Diseñador Web</li>
                <li>Programador</li>
                <li>UX/UI</li>
                <li>Administrador de Sistemas</li>
              </ul>
            </div>

            <div className="team-member">
              <img src="/assets/nosotros/adri.png" alt="Adrián Jiménez" />
              <h3>Adrián Jiménez</h3>
              <p>
                Encargado del marketing con amplia experiencia en E-Commerce.
                Destaca por su don de gentes, solución con las personas y
                rapidez en la resolución de problemas.
              </p>
              <p>
                <strong>Roles principales:</strong>
              </p>
              <ul>
                <li>Expansión del negocio</li>
                <li>Campañas de Marketing</li>
                <li>Programador</li>
                <li>UX/UI</li>
              </ul>
            </div>

            <div className="team-member">
              <img src="/assets/nosotros/gio.png" alt="Giovanni Giove" />
              <h3>Giovanni Giove</h3>
              <p>
                Con más de 3 años de experiencia, se destaca en la gestión de
                clientes y público de todas las edades, y una rápida
                adaptabilidad en situaciones adversas.
              </p>
              <p>
                <strong>Roles principales:</strong>
              </p>
              <ul>
                <li>Diseñador Web</li>
                <li>Programador</li>
                <li>Estudios de Mercado</li>
              </ul>
            </div>

            <div className="team-member">
              <img src="/assets/nosotros/david.png" alt="David Márquez" />
              <h3>David Márquez</h3>
              <p>
                Técnico audiovisual con más de 12 años como fotógrafo,
                videógrafo, editor de vídeo y operador de cámara tanto de ENG
                como PTZ. Dentro de mis habilidades se encuentra el diseño
                gráfico y la gestión de equipos.
              </p>
              <p>
                <strong>Roles principales:</strong>
              </p>
              <ul>
                <li>Diseñador Web</li>
                <li>Programador</li>
                <li>UX/UI</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mision-section">
          <h3>La misión empresarial</h3>
          <p>
            Nuestra misión es fomentar el hábito de la lectura entre las nuevas
            generaciones mediante un acceso sencillo, rápido y asequible a
            libros digitales, ofreciendo una amplía selección de títulos en
            varios idiomas y temas. A través de una experiencia de compra
            accesible y personalizada, buscamos reavivar el interés por la
            lectura y hacerla parte integral de la vida de nuestros clientes
          </p>
        </section>

        <section className="vision-section">
          <h3>La vision empresarial</h3>
          <p>
            Nuestra visión es convertirnos en la plataforma líder en el mercado
            de libros dígitales, reconocida por su diversidad de contenido,
            innovación en la presentación de paquetes temáticos, y capacidad de
            adaptación a las necesidades de lectores modernos y digitales.
            Queremos ser referentes en la promoción de la lectura digital en
            habla hispana e inglesa, creado una comunidad de lectores que
            valoren la cultura, la educación y la exploración de nuevos géneros.
          </p>
        </section>

        <section className="valores-section">
          <h3>Los valores corporativos</h3>
          <p>
            Nuestros valores se centran en la accesibilidad, innovación, y el
            compromiso con la cultura y la educación, ofreciendo una plataforma
            de fácil acceso que promueve el hábito de la lectura de manera
            sostenible y responsable a través de libros digitales. Nos enfocamos
            en brindar un servicio de calidad y en constante mejora,
            adaptándonos a las necesidades de nuestros clientes, fomenttado su
            desarollo personal y reduciendo el impacto ambiental mediante el
            consumo digital.
          </p>
          <iframe
            title="Ubicación de Bookflix"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317144.9631996574!2d-4.65608193550686!3d36.719444890071095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f77c42a3e9ff%3A0x4f57342119a1e5cf!2sM%C3%A1laga!5e0!3m2!1ses!2ses!4v1638010349502!5m2!1ses!2ses"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <p>Teléfono: 965 56 56 56</p>
          <p>Dirección: C/ Ortega y Gasset N1, Málaga, España</p>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default SobreNosotros;
