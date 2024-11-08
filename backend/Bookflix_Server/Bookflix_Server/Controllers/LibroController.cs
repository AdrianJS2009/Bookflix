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
        private const int TamañoPagina = 10;

        public LibroController(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Filtros y paginación
        [HttpGet("ListarLibros")]
        public async Task<IActionResult> GetLibros(
    string textoBuscado = null,
    double? precioMin = null,
    double? precioMax = null,
    string genero = null,  // Añadimos el parámetro genero
    string ordenPor = null,
    bool ascendente = true,
    int pagina = 1,
    int tamanoPagina = TamañoPagina)
        {
            try
            {
                if (pagina <= 0) return BadRequest(new { error = "El número de página debe ser mayor que cero." });

                IQueryable<Libro> librosQuery;

                // Filtrar por texto buscado
                if (!string.IsNullOrWhiteSpace(textoBuscado))
                {
                    librosQuery = _context.Libros
                        .Where(l =>
                            l.Nombre.ToLower().Contains(textoBuscado.ToLower()) ||
                            l.Autor.ToLower().Contains(textoBuscado.ToLower()) ||
                            l.Genero.ToLower().Contains(textoBuscado.ToLower()) ||
                            l.ISBN == textoBuscado);
                }
                else
                {
                    librosQuery = _context.Libros;
                }

                // Filtrar por precio mínimo y máximo
                if (precioMin.HasValue)
                {
                    librosQuery = librosQuery.Where(l => l.Precio >= precioMin.Value);
                }
                if (precioMax.HasValue)
                {
                    librosQuery = librosQuery.Where(l => l.Precio <= precioMax.Value);
                }

                
                if (!string.IsNullOrEmpty(genero))
                {
                    librosQuery = librosQuery.Where(l => l.Genero.ToLower() == genero.ToLower());
                }

                // Ordenación
                librosQuery = ordenPor switch
                {
                    "precio" => ascendente ? librosQuery.OrderBy(l => l.Precio) : librosQuery.OrderByDescending(l => l.Precio),
                    "nombre" => ascendente ? librosQuery.OrderBy(l => l.Nombre) : librosQuery.OrderByDescending(l => l.Nombre),
                    _ => librosQuery
                };

                // Paginación
                var totalLibros = await librosQuery.CountAsync();
                var totalPaginas = (int)Math.Ceiling(totalLibros / (double)tamanoPagina);

                var libros = await librosQuery
                    .Skip((pagina - 1) * tamanoPagina)
                    .Take(tamanoPagina)
                    .ToListAsync();

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
