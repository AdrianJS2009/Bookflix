using Bookflix_Server.DTOs;
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authorization;
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
            try
            {
                // Log the inputs to confirm they're correct
                Console.WriteLine($"Attempting to delete item with libroId: {libroId} for userId: {userId}");

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
            catch (Exception ex)
            {
                // Log the exception if something goes wrong
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
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

        [HttpGet("{userId}/checkPurchase/{productoId}")]
        [Authorize]
        public async Task<IActionResult> CheckPurchaseStatus(int userId, int productoId)
        {
            // comprobamos si está comprao
            var hasPurchased = await _carritoRepository.HasUserPurchasedProductAsync(userId, productoId);

            return Ok(new { hasPurchased });
        }


        [HttpPost("{userId}/comprar")]
        [Authorize]
        public async Task<IActionResult> RegistrarCompra(int userId)
        {
            var carrito = await _carritoRepository.GetCarritoByUserIdAsync(userId);

            if (carrito == null || !carrito.Items.Any())
            {
                return BadRequest(new { error = "No hay artículos en el carrito para comprar." });
            }

            foreach (var item in carrito.Items)
            {
                item.Comprado = true;
            }

            foreach (var item in carrito.Items)
            {
                var producto = await _productoRepository.GetByIdAsync(item.LibroId);
                if (producto != null)
                {
                    if (producto.Stock < item.Cantidad)
                    {
                        return BadRequest(new { error = $"Stock insuficiente para el producto con ID {item.LibroId}" });
                    }

                    producto.Stock -= item.Cantidad;
                }
            }

            await _carritoRepository.SaveChangesAsync();
            return Ok(new { success = true, message = "Compra registrada correctamente." });
        }




    }
}
