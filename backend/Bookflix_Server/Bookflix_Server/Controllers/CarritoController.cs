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
        private readonly IProductoRepository _productoRepository;

        public CarritoController(ICarritoRepository carritoRepository, IProductoRepository productoRepository)
        {
            _carritoRepository = carritoRepository;
            _productoRepository = productoRepository;
        }

        // Obtener carrito
        [HttpGet("{idUsuario}")]
        public async Task<IActionResult> ObtenerCarrito(int idUsuario)
        {
            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(idUsuario);
            return carritoUsuario == null
                ? NotFound(new { error = "No existe un carrito asociado al usuario." })
                : Ok(carritoUsuario);
        }

        // Agregar producto al carrito
        [HttpPost("{idUsuario}/agregar")]
        public async Task<IActionResult> AgregarProductoAlCarrito(int idUsuario, [FromBody] CarritoItemAgregarDto itemDto)
        {
            var producto = await _productoRepository.ObtenerPorIdAsync(itemDto.LibroId);
            if (producto == null)
            {
                return NotFound(new { error = "El producto especificado no se encuentra disponible." });
            }

            if (producto.Stock < itemDto.Cantidad)
            {
                return BadRequest(new { error = "No hay suficiente stock para completar la acción.", stockDisponible = producto.Stock });
            }

            var carritoUsuario = await _carritoRepository.ObtenerOCrearCarritoPorUsuarioIdAsync(idUsuario);
            await _carritoRepository.AgregarProductoAlCarritoAsync(carritoUsuario, itemDto.LibroId, itemDto.Cantidad);

            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "El producto se ha añadido al carrito exitosamente." });
        }

        // Eliminar producto del carrito
        [HttpDelete("{idUsuario}/eliminar/{idProducto}")]
        public async Task<IActionResult> EliminarProductoDelCarrito(int idUsuario, int idProducto)
        {
            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(idUsuario);
            if (carritoUsuario == null)
            {
                return NotFound(new { error = "No existe un carrito asociado al usuario." });
            }

            bool productoEliminado = await _carritoRepository.EliminarProductoDelCarritoAsync(carritoUsuario, idProducto);
            if (!productoEliminado)
            {
                return NotFound(new { error = "El producto no se encuentra en el carrito." });
            }

            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "El producto se ha eliminado del carrito exitosamente." });
        }

        // Vaciar carrito
        [HttpDelete("{idUsuario}/vaciar")]
        public async Task<IActionResult> VaciarCarrito(int idUsuario)
        {
            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(idUsuario);
            if (carritoUsuario == null)
            {
                return NotFound(new { error = "No existe un carrito asociado al usuario." });
            }

            await _carritoRepository.VaciarCarritoAsync(carritoUsuario);
            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "El carrito se ha vaciado correctamente." });
        }

        // Verificar estado de compra
        [HttpGet("{idUsuario}/verificar-compra/{idProducto}")]
        [Authorize]
        public async Task<IActionResult> VerificarEstadoDeCompra(int idUsuario, int idProducto)
        {
            var haComprado = await _carritoRepository.UsuarioHaCompradoProductoAsync(idUsuario, idProducto);
            return Ok(new { haComprado });
        }

        // Confirmar compra
        [HttpPost("{idUsuario}/confirmar-compra")]
        [Authorize]
        public async Task<IActionResult> ConfirmarCompra(int idUsuario)
        {
            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(idUsuario);

            if (carritoUsuario == null || !carritoUsuario.Items.Any())
            {
                return BadRequest(new { error = "No hay productos en el carrito para realizar la compra." });
            }

            foreach (var productoCarrito in carritoUsuario.Items)
            {
                productoCarrito.Comprado = true;
            }

            foreach (var productoCarrito in carritoUsuario.Items)
            {
                var producto = await _productoRepository.ObtenerPorIdAsync(productoCarrito.LibroId);
                if (producto != null)
                {
                    if (producto.Stock < productoCarrito.Cantidad)
                    {
                        return BadRequest(new { error = $"Stock insuficiente para el producto con ID {productoCarrito.LibroId}." });
                    }

                    producto.Stock -= productoCarrito.Cantidad;
                }
            }

            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "La compra se ha confirmado exitosamente y el carrito ha sido actualizado." });
        }
    }
}
