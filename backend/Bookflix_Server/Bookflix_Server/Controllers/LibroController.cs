using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Bookflix_Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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

        // Filtros y paginación
        [HttpGet("ListarLibros")]
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

        // Clasificación de una reseña usando IA
        [HttpPost("clasificarReseña")]
        public IActionResult ClasificarReseña([FromBody] string textoReseña)
        {
            if (string.IsNullOrEmpty(textoReseña))
                return BadRequest("El texto de la reseña no puede estar vacío.");

            var resultado = _iaService.Predict(textoReseña);
            return Ok(new { categoria = resultado.PredictedLabel });
        }

        // Obtener detalles de un libro y sus reseñas
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

            var promedioEstrellas = libro.Reseñas.Any() ? libro.Reseñas.Average(r => r.Estrellas) : 0;
            var totalReseñas = libro.Reseñas.Count;

            var libroDto = new LibroDTO
            {
                IdLibro = libro.IdLibro,
                Nombre = libro.Nombre,
                Precio = libro.Precio,
                UrlImagen = libro.UrlImagen,
                Genero = libro.Genero,
                Descripcion = libro.Descripcion,
                Autor = libro.Autor,
                ISBN = libro.ISBN,
                Stock = libro.Stock
            };

            var reseñasDto = libro.Reseñas
                .OrderByDescending(r => r.FechaPublicacion)
                .Select(r => new ReseñaDetalleDTO
                {
                    IdReseña = r.IdReseña,
                    Autor = r.Autor,
                    Texto = r.Texto,
                    Estrellas = r.Estrellas,
                    Categoria = r.Categoria,
                    FechaPublicacion = r.FechaPublicacion
                })
                .ToList();

            return Ok(new
            {
                libro = libroDto,
                promedioEstrellas = promedioEstrellas,
                totalReseñas = totalReseñas,
                reseñas = reseñasDto
            });
        }

        // Paginación dinámica
        [HttpGet("Catalogo")]
        public async Task<IActionResult> GetCatalogo([FromQuery] int page = 1)
        {
            if (page <= 0) return BadRequest("El número de página debe ser mayor que cero.");

            var totalLibros = await _context.Libros.CountAsync();
            var totalPaginas = (int)Math.Ceiling(totalLibros / (double)TamañoPagina);

            var libros = await _context.Libros
                .Skip((page - 1) * TamañoPagina)
                .Take(TamañoPagina)
                .Select(l => new LibroDTO
                {
                    IdLibro = l.IdLibro,
                    Nombre = l.Nombre,
                    Precio = l.Precio,
                    UrlImagen = l.UrlImagen,
                    Genero = l.Genero,
                    Descripcion = l.Descripcion
                })
                .ToListAsync();

            return Ok(new
            {
                TotalLibros = totalLibros,
                TotalPaginas = totalPaginas,
                Libros = libros
            });
        }

        // Verificar stock antes de añadir al carrito
        [HttpPost("CheckStock/{id}")]
        public async Task<IActionResult> CheckStock(int id, [FromBody] int quantity)
        {
            var libro = await _context.Libros.FindAsync(id);

            if (libro == null)
                return NotFound("Libro no encontrado.");

            if (libro.Stock >= quantity)
                return Ok(new { stockDisponible = true });

            return BadRequest(new { stockDisponible = false, mensaje = "No hay suficiente stock." });
        }

        [HttpGet("{userId}/checkPurchase/{libroId}")]
        public async Task<IActionResult> CheckPurchaseStatus(int userId, int libroId)
        {
            var carrito = await _icarritoRepository.GetCarritoByUserIdAsync(userId);

            if (carrito == null)
            {
                return NotFound(new { error = "Carrito no encontrado" });
            }

            // Verificar si el producto está en el carrito del usuario y ha sido comprado
            bool hasPurchased = carrito.Items.Any(item => item.LibroId == libroId && item.Comprado);

            return Ok(new { hasPurchased });
        }
    }
}
