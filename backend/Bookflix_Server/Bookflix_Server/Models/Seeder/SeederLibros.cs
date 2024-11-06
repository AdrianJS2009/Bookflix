using Bookflix_Server.Data;

namespace Bookflix_Server.Models.Seeder;

public class SeederLibros
{
    private readonly MyDbContext _context;

    public SeederLibros(MyDbContext context)
    {
        _context = context;
    }

    public async Task Seeder()
    {

        //Verificamos si ya hay libros en la BBDD antes de nada
        if (_context.Libros.Any())
        {
            return;
        }

        List<Libro> libros = new List<Libro>
        {

            new Libro
            {
                IdLibro = 1,
                Nombre = "Invisible",
                Precio = 10.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/71rDyMBfBoL._SY466_.jpg",
                Genero = "Literatura",
                Descripcion = "Descripción del libro Invisible",
                Stock = 50,
                ISBN = "9781234567800",
                Autor = "Eloy Moreno",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 2,
                Nombre = "Hábitos atómicos: Cambios pequeños, resultados extraordinarios",
                Precio = 11.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/71prwdyuE7L._SY466_.jpg",
                Genero = "Autoayuda",
                Descripcion = "Un libro sobre cómo pequeños cambios pueden traer resultados extraordinarios.",
                Stock = 60,
                ISBN = "9781234567801",
                Autor = "James Clear",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 3,
                Nombre = "Redes (Invisible 2)",
                Precio = 13.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/71qlSpgJHBL._SY466_.jpg",
                Genero = "Literatura",
                Descripcion = "Continuación de la historia de 'Invisible', explorando nuevos desafíos.",
                Stock = 70,
                ISBN = "9781234567802",
                Autor = "Eloy Moreno",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 4,
                Nombre = "Enciclopedia Pokémon (Colección Pokémon)-Español",
                Precio = 14.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/81ZP7q5e78L._SY466_.jpg",
                Genero = "Referencia",
                Descripcion = "Una enciclopedia completa sobre Pokémon.",
                Stock = 80,
                ISBN = "9781234567803",
                Autor = "The Pokémon Company",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 5,
                Nombre = "Un Libro Guay Sobre Aviones: Curiosidades y otros cuentos",
                Precio = 16.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/51MAm1ubRLL._SY466_.jpg",
                Genero = "Literatura",
                Descripcion = "Curiosidades y cuentos sobre aviones.",
                Stock = 90,
                ISBN = "9781234567804",
                Autor = "Dario Borhani",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 6,
                Nombre = "Accidentes Aéreos: Las 10 Catástrofes Aéreas Más Mortíferas y las Lecciones Que Hemos Aprendido Para Mejorar la Seguridad Aérea",
                Precio = 17.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/61tBF4gNZhL._SY466_.jpg",
                Genero = "Literatura",
                Descripcion = "Análisis de accidentes aéreos y las lecciones aprendidas.",
                Stock = 100,
                ISBN = "9781234567805",
                Autor = "Oliver Elliot",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 7,
                Nombre = "1000 preguntas y curiosidades sobre aviación",
                Precio = 19.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61QtqaX-k-L._SY466_.jpg",
                Genero = "Literatura",
                Descripcion = "Preguntas y datos curiosos sobre aviación.",
                Stock = 110,
                ISBN = "9781234567806",
                Autor = "Victor Díaz",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 8,
                Nombre = "Aviones de combate. Los cazas legendarios (ILUSTRADO)",
                Precio = 20.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/81AH9tAltbL._SY466_.jpg",
                Genero = "Ilustrado",
                Descripcion = "Historia y detalles de aviones de combate legendarios.",
                Stock = 120,
                ISBN = "9781234567807",
                Autor = "Riccardo Niccoli",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 9,
                Nombre = "La edad de oro de los videojuegos 1970-1999: La historia del retrogaming (LOOK)",
                Precio = 22.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/71ZMdyOmX8L._SY466_.jpg",
                Genero = "Historia",
                Descripcion = "Historia del retrogaming y los videojuegos clásicos.",
                Stock = 130,
                ISBN = "9781234567808",
                Autor = "Iván Battle",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 10,
                Nombre = "Guía para principiantes: Cómo empezar un negocio",
                Precio = 23.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/61SDQNykgXL._SY466_.jpg",
                Genero = "Emprendimiento",
                Descripcion = "Consejos y pasos para comenzar un negocio.",
                Stock = 140,
                ISBN = "9781234567809",
                Autor = "Andrew Rehbein",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 11,
                Nombre = "ChatGPT Hecho Simple",
                Precio = 25.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61ZIdmNjTWL._SY466_.jpg",
                Genero = "Tecnología",
                Descripcion = "Cómo usar la inteligencia artificial para potenciar la productividad.",
                Stock = 150,
                ISBN = "9781234567810",
                Autor = "D. Nardo Publications",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 12,
                Nombre = "Curso de programación Java (MANUALES IMPRESCINDIBLES)",
                Precio = 26.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/41BSkOAx8-L._SX342_SY445_.jpg",
                Genero = "Programación",
                Descripcion = "Manual esencial para aprender Java.",
                Stock = 160,
                ISBN = "9781234567811",
                Autor = "Mariona Nadal Farre",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 13,
                Nombre = "Curso de JavaScript (MANUALES IMPRESCINDIBLES)",
                Precio = 28.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61zCD57q64L._SY466_.jpg",
                Genero = "Programación",
                Descripcion = "Guía completa para aprender JavaScript.",
                Stock = 170,
                ISBN = "9781234567812",
                Autor = "Astor de Caso Parra",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 14,
                Nombre = "Curso de PHP 8 y MySQL 8",
                Precio = 29.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/61q+BrtK31L._SY466_.jpg",
                Genero = "Programación",
                Descripcion = "Curso práctico de PHP y MySQL.",
                Stock = 180,
                ISBN = "9781234567813",
                Autor = "Luis Miguel Cabezas Granado",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 15,
                Nombre = "Alas de sangre (Empíreo 1) Edición coleccionista enriquecida y limitada",
                Precio = 31.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/814lXWoCIFL._SY466_.jpg",
                Genero = "Fantasía",
                Descripcion = "Primera entrega de la serie Empíreo.",
                Stock = 190,
                ISBN = "9781234567814",
                Autor = "Rebecca Yarros",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 16,
                Nombre = "Alas de hierro (Empíreo 2) Edición coleccionista enriquecida y limitada",
                Precio = 32.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/81zBPZ2O+sL._SY466_.jpg",
                Genero = "Fantasía",
                Descripcion = "Segunda entrega de la serie Empíreo.",
                Stock = 200,
                ISBN = "9781234567815",
                Autor = "Rebecca Yarros",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 17,
                Nombre = "Sólo yo",
                Precio = 34.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/71eoASuyuhL._SY466_.jpg",
                Genero = "Narrativa",
                Descripcion = "Una obra introspectiva y única.",
                Stock = 210,
                ISBN = "9781234567816",
                Autor = "Blake Pierce",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 18,
                Nombre = "El niño con el pijama de rayas",
                Precio = 35.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/91OyzQ4MrJL._SY466_.jpg",
                Genero = "Drama",
                Descripcion = "Una conmovedora historia ambientada en la Segunda Guerra Mundial.",
                Stock = 220,
                ISBN = "9781234567817",
                Autor = "John Boyne",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 19,
                Nombre = "El mundo está en venta: La cara oculta del negocio de las materias primas",
                Precio = 37.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/812WF976qML._SY466_.jpg",
                Genero = "Economía",
                Descripcion = "Un análisis profundo del negocio de las materias primas.",
                Stock = 230,
                ISBN = "9781234567818",
                Autor = "Javier Blas",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 20,
                Nombre = "El Clan",
                Precio = 38.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/71aoW-+kY+L._SY466_.jpg",
                Genero = "Novela",
                Descripcion = "Una historia sobre lazos familiares y secretos.",
                Stock = 240,
                ISBN = "9781234567819",
                Autor = "Carmen Mola",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 21,
                Nombre = "El niño que perdió la guerra",
                Precio = 40.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/81nDcs2hHzL._SY466_.jpg",
                Genero = "Drama",
                Descripcion = "Una historia conmovedora sobre un niño y la guerra.",
                Stock = 250,
                ISBN = "9781234567820",
                Autor = "Julia Navarro",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 22,
                Nombre = "CADA NIÑA QUE MURIÓ",
                Precio = 41.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/81TdmBJ0tqL._SY466_.jpg",
                Genero = "Thriller",
                Descripcion = "Una trama oscura sobre el destino de niñas perdidas.",
                Stock = 260,
                ISBN = "9781234567821",
                Autor = "Marta Martín Girón",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 23,
                Nombre = "El monje que vendió su Ferrari",
                Precio = 43.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/81KbajSAThL._SY466_.jpg",
                Genero = "Autoayuda",
                Descripcion = "Una parábola sobre cómo encontrar la felicidad.",
                Stock = 270,
                ISBN = "9781234567822",
                Autor = "Robin Sharma",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 24,
                Nombre = "Meditaciones",
                Precio = 44.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/71fiwEr3WGL._SY466_.jpg",
                Genero = "Filosofía",
                Descripcion = "Pensamientos de Marco Aurelio sobre la vida y la virtud.",
                Stock = 280,
                ISBN = "9781234567823",
                Autor = "Marco Aurelio",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 25,
                Nombre = "El arte de la guerra",
                Precio = 46.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61HSZIxRXjL._SY466_.jpg",
                Genero = "Filosofía militar",
                Descripcion = "El tratado clásico sobre estrategia y táctica militar.",
                Stock = 290,
                ISBN = "9781234567824",
                Autor = "Sun Tzu",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 26,
                Nombre = "Las 48 leyes del poder",
                Precio = 47.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/61JKEWnsikL._SY466_.jpg",
                Genero = "No ficción",
                Descripcion = "Una guía sobre cómo obtener y mantener el poder.",
                Stock = 300,
                ISBN = "9781234567825",
                Autor = "Robert Greene",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 27,
                Nombre = "Burlando al Diablo",
                Precio = 49.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61te9K3LxPL._SY466_.jpg",
                Genero = "Autoayuda",
                Descripcion = "Una conversación con el diablo sobre el miedo y el éxito.",
                Stock = 310,
                ISBN = "9781234567826",
                Autor = "Napoleon Hill",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 28,
                Nombre = "Quién eres tú y qué haces aquí",
                Precio = 50.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/51kEpUge-yL._SY466_.jpg",
                Genero = "Reflexión",
                Descripcion = "Un libro introspectivo sobre el propósito de la vida.",
                Stock = 320,
                ISBN = "9781234567827",
                Autor = "Jesús Yanes",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 29,
                Nombre = "100 Dias de Despertar, Un diario espiritual",
                Precio = 52.0m,
                UrlImagen = "https://m.media-amazon.com/images/I/61y1mlbs6DL._SY466_.jpg",
                Genero = "Espiritualidad",
                Descripcion = "Un diario para reflexionar y despertar la conciencia.",
                Stock = 330,
                ISBN = "9781234567828",
                Autor = "Anónimo",
                Reseñas = new List<Reseña>()
            },
            new Libro
            {
                IdLibro = 30,
                Nombre = "El poder de la palabra: PNL",
                Precio = 53.5m,
                UrlImagen = "https://m.media-amazon.com/images/I/61L4j3QD7XL._SY466_.jpg",
                Genero = "Psicología",
                Descripcion = "Exploración sobre el poder de la palabra y la PNL.",
                Stock = 340,
                ISBN = "9781234567829",
                Autor = "Robert Dilts",
                Reseñas = new List<Reseña>()
            }
        };
        _context.Libros.AddRange(libros);
        await _context.SaveChangesAsync();
    }
}
