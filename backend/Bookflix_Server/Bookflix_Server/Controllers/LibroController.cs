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
                .Include(l => l.Reseñas)
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
                Genero = libro.Genero,
                Autor = libro.Autor,
                ISBN = libro.ISBN,
                Stock = libro.Stock,
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
        [AllowAnonymous]
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
        [Authorize]
        public IActionResult ClasificarReseña([FromBody] string textoReseña)
        {
            if (string.IsNullOrEmpty(textoReseña))
                return BadRequest("El texto de la reseña no puede estar vacío.");

            var resultado = _iaService.Predict(textoReseña);
            return Ok(new { categoria = resultado.PredictedLabel });
        }

        [HttpPost("publicarResena")]
        [AllowAnonymous] // Temporal para pruebas
        public async Task<IActionResult> PublicarResena([FromBody] ReseñaDTO reseñaDto)
        {
            try
            {
                if (reseñaDto == null || string.IsNullOrWhiteSpace(reseñaDto.Texto))
                    return BadRequest("La reseña no puede estar vacía.");

                if (!int.TryParse(reseñaDto.ProductoId.ToString(), out var productoId))
                    return BadRequest("ProductoId no es válido.");

                // Si el usuario no está autenticado, usar "Usuario Anónimo"
                var usuarioId = User?.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
                string autor = "Usuario Anónimo"; // Valor predeterminado
                int? userId = null;

                if (usuarioId != null && int.TryParse(usuarioId, out var parsedUserId))
                {
                    userId = parsedUserId;

                    var usuario = await _context.Users.FindAsync(userId);
                    if (usuario != null)
                    {
                        autor = usuario.Nombre; // Usar el nombre del usuario autenticado
                    }

                    // Verificar si el usuario ha comprado el producto antes de permitir la reseña
                    var hasPurchased = await _context.Carritos
                        .Include(c => c.Items)
                        .AnyAsync(c => c.UserId == userId.Value && c.Items.Any(item => item.LibroId == productoId && item.Comprado));

                    if (!hasPurchased)
                        return Unauthorized("Debe comprar el producto antes de agregar una reseña.");
                }

                var libro = await _context.Libros.FindAsync(productoId);
                if (libro == null)
                    return NotFound("Libro no encontrado.");

                // Clasificar la categoría de la reseña usando la IA
                var prediccion = _iaService.Predict(reseñaDto.Texto);
                var categoria = prediccion != null ? prediccion.PredictedLabel.ToString() : "Sin Clasificar";

                var reseña = new Reseña
                {
                    UsuarioId = userId ?? 0, // Si userId es null, usar un valor predeterminado (e.g., 0)
                    ProductoId = productoId,
                    Texto = reseñaDto.Texto,
                    Categoria = categoria,
                    FechaPublicacion = DateTime.UtcNow,
                    Autor = autor, // Asegurarse de que Autor siempre tenga un valor
                    Estrellas = reseñaDto.Estrellas
                };

                _context.Reseñas.Add(reseña);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Reseña publicada con éxito.",
                    categoria = categoria
                });
            }
            catch (Exception ex)
            {
                // Loggear el error para depuración
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }


    }
}
