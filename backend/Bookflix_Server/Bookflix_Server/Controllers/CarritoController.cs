using Bookflix_Server.DTOs;
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Bookflix_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoRepository _carritoRepository;
        private readonly IProductoRepository _productoRepository; // Usando IProductoRepository

        public CarritoController(ICarritoRepository carritoRepository, IProductoRepository productoRepository)
        {
            _carritoRepository = carritoRepository;
            _productoRepository = productoRepository;
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
            // Verificar si el producto existe y chequear stock
            var producto = await _productoRepository.GetByIdAsync(itemDto.LibroId);
            if (producto == null)
            {
                return NotFound(new { error = "Producto no encontrado" });
            }

            if (producto.Stock < itemDto.Cantidad)
            {
                return BadRequest(new { error = "Stock insuficiente", stockDisponible = producto.Stock });
            }

            // Añadir el artículo al carrito si el stock es suficiente
            var carrito = await _carritoRepository.GetOrCreateCarritoByUserIdAsync(userId);
            await _carritoRepository.AgregarItemAlCarritoAsync(carrito, itemDto.LibroId, itemDto.Cantidad);

            // Guardar cambios
            await _carritoRepository.SaveChangesAsync();

            return Ok(new { success = true, message = "Producto añadido al carrito correctamente" });
        }

        [HttpDelete("{userId}/eliminar/{libroId}")]
        public async Task<IActionResult> EliminarItem(int userId, int libroId)
        {
            var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId);
            if (carrito == null)
            {
                return NotFound(new { error = "Carrito no encontrado" });
            }

            bool itemEliminado = await _carritoRepository.EliminarItemDelCarritoAsync(carrito, libroId);
            if (!itemEliminado)
            {
                return NotFound(new { error = "El artículo no está en el carrito" });
            }

            await _carritoRepository.SaveChangesAsync();

            return Ok(new { success = true, message = "Artículo eliminado del carrito correctamente" });
        }

        [HttpDelete("{userId}/limpiar")]
        public async Task<IActionResult> LimpiarCarrito(int userId)
        {
            var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId);
            if (carrito == null)
            {
                return NotFound(new { error = "Carrito no encontrado" });
            }

            await _carritoRepository.LimpiarCarritoAsync(carrito);
            await _carritoRepository.SaveChangesAsync();

            return Ok(new { success = true, message = "Carrito limpiado correctamente" });
        }

        [HttpGet("{userId}/checkPurchase/{libroId}")]
        public async Task<IActionResult> CheckPurchaseStatus(int userId, int libroId)
        {
            var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId);

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
