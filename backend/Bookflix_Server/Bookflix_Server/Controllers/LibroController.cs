

using Bookflix_Server.Data;
using Bookflix_Server.Models.DTOs;
using Bookflix_Server.Repositories;
using Bookflix_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibroController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ServicioBusquedaInteligente _smartSearchService;
        private readonly ICarritoRepository _icarritoRepository;
        private const int TamanoPagina = 10;



        public LibroController(MyDbContext context, ServicioBusquedaInteligente smartSearchService, ICarritoRepository carritoRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _smartSearchService = smartSearchService ?? throw new ArgumentNullException(nameof(smartSearchService));
            _icarritoRepository = carritoRepository ?? throw new ArgumentNullException(nameof(carritoRepository));

           
            _smartSearchService.InicializarLibrosAsync().Wait();
        }



        private string ObtenerCorreoUsuario()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
        }

        [HttpGet("Detalle/{idLibro}")]
        public async Task<ActionResult> ObtenerLibroPorId(int idLibro)
        {
            var libro = await _context.Libros
                .Include(l => l.Reseñas)
                .FirstOrDefaultAsync(l => l.IdLibro == idLibro);

            if (libro == null)
            {
                return NotFound("El libro especificado no fue encontrado.");
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
                    r.Autor,
                    r.Texto,
                    r.Estrellas,
                    r.Categoria,
                    FechaPublicacion = r.FechaPublicacion.ToString("yyyy-MM-dd HH:mm:ss")
                })
            };

            return Ok(libroDto);
        }

        [HttpGet("ListarLibros")]
        [AllowAnonymous]
        public async Task<IActionResult> ListarLibros(
            string textoBusqueda = null,
            double? precioMin = null,
            double? precioMax = null,
            string genero = null,
            string ordenarPor = null,
            bool ascendente = true,
            int pagina = 1,
            int tamanoPagina = TamanoPagina)
        {
            try
            {
                if (pagina <= 0)
                    return BadRequest(new { error = "El número de página debe ser mayor que cero." });
                if (tamanoPagina <= 0)
                    tamanoPagina = TamanoPagina;

                IQueryable<Libro> librosQuery;

                if (!string.IsNullOrWhiteSpace(textoBusqueda))
                {
                    var resultadoBusqueda = _smartSearchService.Buscar(textoBusqueda);

                    if (resultadoBusqueda == null || !resultadoBusqueda.Any())
                    {
                        return Ok(new
                        {
                            libros = new List<LibroDTO>(),
                            totalLibros = 0,
                            totalPaginas = 0
                        });
                    }

                    librosQuery = _context.Libros.Where(l =>
                        resultadoBusqueda.Contains(l.Nombre) ||
                        resultadoBusqueda.Contains(l.Autor) ||
                        resultadoBusqueda.Contains(l.Genero) ||
                        resultadoBusqueda.Contains(l.ISBN));
                }
                else
                {
                    librosQuery = _context.Libros;
                }


                if (precioMin.HasValue)
                    librosQuery = librosQuery.Where(l => l.Precio >= precioMin.Value);

                if (precioMax.HasValue)
                    librosQuery = librosQuery.Where(l => l.Precio <= precioMax.Value);

                if (!string.IsNullOrEmpty(genero))
                    librosQuery = librosQuery.Where(l => l.Genero.ToLower() == genero.ToLower());

                librosQuery = ordenarPor switch
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
                    .ToListAsync();

                var librosDto = libros.Select(l => new LibroDTO
                {
                    IdLibro = l.IdLibro,
                    Nombre = l.Nombre,
                    Precio = l.Precio,
                    UrlImagen = l.UrlImagen,
                    Genero = l.Genero,
                    Descripcion = l.Descripcion,
                    Autor = l.Autor,
                    ISBN = l.ISBN,
                    Stock = l.Stock,
                    PromedioEstrellas = l.PromedioEstrellas
                }).ToList();


                return Ok(new
                {
                    libros = librosDto,
                    totalLibros = totalLibros,
                    totalPaginas = totalPaginas
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
            }
        }


        [HttpPost("VerificarStock")]
        public async Task<IActionResult> VerificarStock([FromBody] List<int> librosIds)
        {
            var stockInfo = new List<object>();

            foreach (var id in librosIds)
            {
                var libro = await _context.Libros.FindAsync(id);
                stockInfo.Add(new
                {
                    Id = id,
                    Stock = libro?.Stock ?? 0,
                    Disponible = libro?.Stock > 0
                });
            }

            return Ok(stockInfo);
        }

        [HttpGet("ItemsCarrusel")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerItemsCarrusel()
        {
            try
            {
                var libros = await _context.Libros
                    .OrderByDescending(l => l.IdLibro)
                    .Take(10)
                    .ToListAsync();

                var librosDto = libros.Select(l => new LibroDTO
                {
                    IdLibro = l.IdLibro,
                    Nombre = l.Nombre,
                    Precio = l.Precio,
                    UrlImagen = l.UrlImagen,
                    Genero = l.Genero,
                    Descripcion = l.Descripcion,
                    Autor = l.Autor,
                    ISBN = l.ISBN,
                    Stock = l.Stock,
                    PromedioEstrellas = l.PromedioEstrellas
                });

                return Ok(librosDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
            }
        }

    }
}
