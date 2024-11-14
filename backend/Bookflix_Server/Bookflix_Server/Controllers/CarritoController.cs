using Bookflix_Server.DTOs; // Agrega el using para el DTO
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace Bookflix_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoRepository _carritoRepository;

        public CarritoController(ICarritoRepository carritoRepository)
        {
            _carritoRepository = carritoRepository;
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
    }
}