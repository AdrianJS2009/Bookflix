using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Bookflix_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibroController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly SmartSearchService _smartSearchService;
        private readonly IAService _iaService;
        private readonly ICarritoRepository _icarritoRepository;
        private const int TamañoPagina = 10;

        public LibroController(MyDbContext context, SmartSearchService smartSearchService, IAService iaService, ICarritoRepository carritoRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _smartSearchService = smartSearchService ?? throw new ArgumentNullException(nameof(smartSearchService));
            _iaService = iaService ?? throw new ArgumentNullException(nameof(iaService));
            _icarritoRepository = carritoRepository ?? throw new ArgumentNullException(nameof(ICarritoRepository));
        }

        [HttpGet("Detalle/{id}")]
        public async Task<ActionResult> GetLibroById(int id)
        {
            var libro = await _context.Libros
                .Include(l => l.Reseñas) // Incluir las reseñas asociadas
                .FirstOrDefaultAsync(l => l.IdLibro == id);

            if (libro == null)
            {
                return NotFound("Libro no encontrado.");
            }

            var libroDto = new
            {
                IdLibro = libro.IdLibro,
                Nombre = libro.Nombre,
                Descripcion = libro.Descripcion,
                Precio = libro.Precio,
                UrlImagen = libro.UrlImagen,
                Reseñas = libro.Reseñas.Select(r => new
                {
                    r.IdReseña,
                    r.Texto,
                    r.Estrellas,
                    r.Categoria,
                    r.FechaPublicacion
                })
            };

            return Ok(libroDto);
        }


        [HttpGet("ListarLibros")]
        [AllowAnonymous] // Público
        public async Task<IActionResult> GetLibros(
            string textoBuscado = null,
            double? precioMin = null,
            double? precioMax = null,
            string genero = null,
            string ordenPor = null,
            bool ascendente = true,
            int pagina = 1,
            int tamanoPagina = TamañoPagina)
        {
            try
            {
                if (pagina <= 0) return BadRequest(new { error = "El número de página debe ser mayor que cero." });

                IQueryable<Libro> librosQuery;

                if (!string.IsNullOrWhiteSpace(textoBuscado))
                {
                    var resultadoBusqueda = _smartSearchService.Search(textoBuscado);
                    librosQuery = _context.Libros.Where(l => resultadoBusqueda.Contains(l.Nombre) ||
                                                             resultadoBusqueda.Contains(l.Autor) ||
                                                             resultadoBusqueda.Contains(l.Genero) ||
                                                             resultadoBusqueda.Contains(l.ISBN));
                }
                else
                {
                    librosQuery = _context.Libros;
                }

                if (precioMin.HasValue) librosQuery = librosQuery.Where(l => l.Precio >= precioMin.Value);
                if (precioMax.HasValue) librosQuery = librosQuery.Where(l => l.Precio <= precioMax.Value);

                if (!string.IsNullOrEmpty(genero))
                {
                    librosQuery = librosQuery.Where(l => l.Genero.ToLower() == genero.ToLower());
                }

                librosQuery = ordenPor switch
                {
                    "precio" => ascendente ? librosQuery.OrderBy(l => l.Precio) : librosQuery.OrderByDescending(l => l.Precio),
                    "nombre" => ascendente ? librosQuery.OrderBy(l => l.Nombre) : librosQuery.OrderByDescending(l => l.Nombre),
                    _ => librosQuery
                };

                var totalLibros = await librosQuery.CountAsync();
                var totalPaginas = (int)Math.Ceiling(totalLibros / (double)tamanoPagina);

                var libros = await librosQuery
                    .Skip((pagina - 1) * tamanoPagina)
                    .Take(tamanoPagina)
                    .Select(l => new LibroDTO
                    {
                        IdLibro = l.IdLibro,
                        Nombre = l.Nombre,
                        Precio = l.Precio,
                        UrlImagen = l.UrlImagen,
                        Genero = l.Genero,
                        Descripcion = l.Descripcion,
                        Autor = l.Autor,
                        ISBN = l.ISBN
                    })
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

        [HttpPost("clasificarReseña")]
        [Authorize] // Protegido
        public IActionResult ClasificarReseña([FromBody] string textoReseña)
        {
            if (string.IsNullOrEmpty(textoReseña))
                return BadRequest("El texto de la reseña no puede estar vacío.");

            var resultado = _iaService.Predict(textoReseña);
            return Ok(new { categoria = resultado.PredictedLabel });
        }

        [HttpPost("publicarReseña")]
        [Authorize] // Protegido
        public async Task<IActionResult> PublicarReseña([FromBody] ReseñaDTO reseñaDto)
        {
            if (reseñaDto == null || string.IsNullOrWhiteSpace(reseñaDto.Texto))
                return BadRequest("La reseña no puede estar vacía.");

            if (!int.TryParse(reseñaDto.ProductoId.ToString(), out var productoId))
                return BadRequest("ProductoId no es válido.");

            var usuarioId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (!int.TryParse(usuarioId, out var userId))
                return Unauthorized("Usuario no autenticado o ID inválido.");

            var libro = await _context.Libros.FindAsync(productoId);

            if (libro == null)
                return NotFound("Libro no encontrado.");

            var reseña = new Reseña
            {
                UsuarioId = userId,
                ProductoId = productoId,
                Texto = reseñaDto.Texto,
                Categoria = _iaService.Predict(reseñaDto.Texto).PredictedLabel.ToString(),
                FechaPublicacion = DateTime.UtcNow
            };

            _context.Reseñas.Add(reseña);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Reseña publicada con éxito." });
        }
    }
}