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

        public LibroController(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet("ListarLibros")]
        public async Task<ActionResult<IEnumerable<Libro>>> GetLibros(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true,
            int pagina = 1,
            int tamanoPagina = 10)
        {
            var librosQuery = _context.Libros
                .Where(l =>
                    (autor == null || l.Autor.Contains(autor)) &&
                    (genero == null || l.Genero.Contains(genero)) &&
                    (isbn == null || l.ISBN == isbn) &&
                    (precioMin == null || l.Precio >= precioMin) &&
                    (precioMax == null || l.Precio <= precioMax));

            librosQuery = ordenPor switch
            {
                "precio" => ascendente ? librosQuery.OrderBy(l => l.Precio) : librosQuery.OrderByDescending(l => l.Precio),
                _ => ascendente ? librosQuery.OrderBy(l => l.Nombre) : librosQuery.OrderByDescending(l => l.Nombre)
            };

            var libros = await librosQuery
                .Skip((pagina - 1) * tamanoPagina)
                .Take(tamanoPagina)
                .ToListAsync();

            return Ok(libros);
        }

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
    }
}
