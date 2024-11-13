using Bookflix_Server.DTOs; // Agrega el using para el DTO
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Bookflix_Server.Data;
using Bookflix_Server.Extensions;

namespace Bookflix_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoRepository _carritoRepository;
        private readonly MyDbContext _context;

        public CarritoController(ICarritoRepository carritoRepository, MyDbContext context)
        {
            _carritoRepository = carritoRepository;
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCarrito(int userId)
        {
            var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId);
            return carrito == null ? NotFound() : Ok(carrito);
        }

        [HttpPost("{userId}/agregar")]
        public async Task<IActionResult> AgregarItem(int userId, [FromBody] CarritoItemAgregarDto itemDto)
        {
            // Usa el DTO en lugar del modelo completo
            await _carritoRepository.AñadirItemAsync(userId, itemDto.LibroId, itemDto.Cantidad);
            return Ok();
        }

        [HttpPut("{userId}/actualizar")]
        public async Task<IActionResult> ActualizarCantidad(int userId, [FromBody] CarritoItem item)
        {
            await _carritoRepository.ActualizarCantidadProductoAsync(userId, item.LibroId, item.Cantidad);
            return Ok();
        }

        [HttpDelete("{userId}/borrar/{libroId}")]
        public async Task<IActionResult> BorrarItem(int userId, int libroId)
        {
            await _carritoRepository.BorrarItemAsync(userId, libroId);
            return Ok();
        }

        [HttpDelete("{userId}/clear")]
        public async Task<IActionResult> ClearCarrito(int userId)
        {
            await _carritoRepository.ClearCarritoAsync(userId);
            return Ok();
        }

        [HttpPost("agregar-temporal")]
        public IActionResult AddToCarritoTemporal([FromBody] CarritoItemAgregarDto itemDto)
        {
            var libro = _context.Libros.Find(itemDto.LibroId);
            if (libro == null)
            {
                return NotFound();
            }

            var carritoItem = new CarritoItem
            {
                LibroId = itemDto.LibroId,
                Libro = libro,
                Cantidad = itemDto.Cantidad
            };

            // Calcular el subtotal y asignarlo a una variable local
            var subtotal = libro.Precio * itemDto.Cantidad;
            carritoItem.GetType().GetProperty("Subtotal").SetValue(carritoItem, subtotal);

            var carritoTemporal = HttpContext.Session.GetObjectFromJson<CarritoTemporal>("CarritoTemporal") ?? new CarritoTemporal();
            carritoTemporal.Items.Add(carritoItem);
            HttpContext.Session.SetObjectAsJson("CarritoTemporal", carritoTemporal);

            return Ok();
        }

        [HttpGet("carrito-temporal")]
        public IActionResult GetCarritoTemporal()
        {
            var carritoTemporal = HttpContext.Session.GetObjectFromJson<CarritoTemporal>("CarritoTemporal");
            return carritoTemporal == null ? NotFound() : Ok(carritoTemporal);
        }

        [HttpPost("migrar-carrito/{userId}")]
        public async Task<IActionResult> MigrateCarritoAsync(int userId)
        {
            var carritoTemporal = HttpContext.Session.GetObjectFromJson<CarritoTemporal>("CarritoTemporal");
            if (carritoTemporal != null)
            {
                var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId) ?? new Carrito { IdUser = userId };
                foreach (var item in carritoTemporal.Items)
                {
                    carrito.Items.Add(item);
                }
                _context.Carritos.Update(carrito);
                await _context.SaveChangesAsync();
                HttpContext.Session.Remove("CarritoTemporal");
            }
            return Ok();
        }

        [HttpGet("{userId}/total")]
        public async Task<IActionResult> GetCarritoTotal(int userId)
        {
            var total = await _carritoRepository.GetCarritoTotalAsync(userId);
            return Ok(total);
        }
    }
}
