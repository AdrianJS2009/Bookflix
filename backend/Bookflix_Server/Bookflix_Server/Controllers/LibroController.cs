using Bookflix_Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibroController : ControllerBase
    {
        private readonly MyDbContext _context;
        private const int TamañoPagina = 10;  // Constante para tamaño de página

        public LibroController(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Endpoint para listar libros con opciones de filtrado, orden y paginación
        [HttpGet("ListarLibros")]
        public async Task<IActionResult> GetLibros(
    string nombre = null,
    string autor = null,
    string genero = null,
    string isbn = null,
    double? precioMin = null,
    double? precioMax = null,
    string ordenPor = null,
    bool ascendente = true,
    int pagina = 1,
    int tamanoPagina = TamañoPagina)
        {
            try
            {
                if (pagina <= 0) return BadRequest(new { error = "El número de página debe ser mayor que cero." });

                // Filtros
                var librosQuery = _context.Libros
                    .Where(l =>
                        (nombre == null || l.Nombre.Contains(nombre)) &&
                        (autor == null || l.Autor.Contains(autor)) &&
                        (genero == null || l.Genero.Contains(genero)) &&
                        (isbn == null || l.ISBN == isbn) &&
                        (precioMin == null || l.Precio >= (decimal)precioMin) &&
                        (precioMax == null || l.Precio <= (decimal)precioMax));

                // Ordenación
                librosQuery = ordenPor switch
                {
                    "precio" => ascendente
                        ? librosQuery.OrderBy(l => (double)l.Precio)
                        : librosQuery.OrderByDescending(l => (double)l.Precio),
                    "nombre" => ascendente
                        ? librosQuery.OrderBy(l => l.Nombre)
                        : librosQuery.OrderByDescending(l => l.Nombre),
                    _ => librosQuery
                };

                // Paginación
                var libros = await librosQuery
                    .Skip((pagina - 1) * tamanoPagina)
                    .Take(tamanoPagina)
                    .ToListAsync();

                // Cálculo del total de libros y páginas
                var totalLibros = await librosQuery.CountAsync();
                var totalPaginas = (int)Math.Ceiling(totalLibros / (double)tamanoPagina);

                return Ok(new
                {
                    libros = libros,
                    totalLibros = totalLibros,
                    totalPaginas = totalPaginas
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
            }
        }

        [HttpGet("Buscador")]
        public async Task<ActionResult<IEnumerable<Libro>>> GetBusqueda(
            string textoBuscado = null,
            int pagina = 1,
            int tamanoPagina = TamañoPagina)
        {
            if (pagina <= 0) return BadRequest("El número de página debe ser mayor que cero.");

            var librosQuery = _context.Libros
                .Where(l =>
                    (l.Nombre.Contains(textoBuscado)) ||
                    (l.Autor.Contains(textoBuscado)) ||
                    (l.Genero.Contains(textoBuscado)) ||
                    (l.ISBN == textoBuscado)
                );


            var libros = await librosQuery
                .Skip((pagina - 1) * tamanoPagina)
                .Take(tamanoPagina)
                .ToListAsync();


            return Ok(libros);
        }
        // Endpoint para obtener detalles de un libro específico
        [HttpGet("Detalle/{id}")]
        public async Task<ActionResult<Libro>> GetLibroById(int id)
        {
            var libro = await _context.Libros.FirstOrDefaultAsync(l => l.IdLibro == id);
            if (libro == null)
            {
                return NotFound("Libro no encontrado.");
            }
            return Ok(libro);
        }

        // Paginación dinámica
        [HttpGet("Catalogo")]
        public async Task<IActionResult> GetCatalogo([FromQuery] int page = 1)
        {
            if (page <= 0) return BadRequest("El número de página debe ser mayor que cero.");


            var totalLibros = await _context.Libros.CountAsync();

            // Calcular el número total de páginas
            var totalPaginas = (int)Math.Ceiling(totalLibros / (double)TamañoPagina);

            // Obtener los libros de la página actual
            var libros = await _context.Libros
                .Skip((page - 1) * TamañoPagina)
                .Take(TamañoPagina)
                .ToListAsync();

            return Ok(new
            {
                TotalLibros = totalLibros,
                TotalPaginas = totalPaginas,
                Libros = libros
            });
        }
    }
}
