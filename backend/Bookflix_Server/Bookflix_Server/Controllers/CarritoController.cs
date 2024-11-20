using Bookflix_Server.DTOs;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bookflix_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoRepository _carritoRepository;
        private readonly IProductoRepository _productoRepository;
        private readonly IUserRepository _userRepository;

        public CarritoController(
            ICarritoRepository carritoRepository,
            IProductoRepository productoRepository,
            IUserRepository userRepository)
        {
            _carritoRepository = carritoRepository;
            _productoRepository = productoRepository;
            _userRepository = userRepository;
        }

        private string ObtenerCorreoUsuario()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value; // Extraer el correo del token
        }

        // Obtener carrito asociado al usuario autenticado o a un correo específico
        [HttpGet("ListarCarrito")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerCarrito(string correo = null)
        {
            string correoUsuario = correo ?? ObtenerCorreoUsuario();
            var usuario = await _userRepository.ObtenerPorCorreoAsync(correoUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var carrito = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carrito == null)
            {
                return NotFound(new { error = "No existe un carrito asociado al usuario." });
            }

            var carritoDto = new CarritoDTO
            {
                CarritoId = carrito.CarritoId,
                UserId = carrito.UserId,
                Items = carrito.Items.Select(item => new CarritoItemDTO
                {
                    LibroId = item.LibroId,
                    NombreLibro = item.Libro?.Nombre,
                    Cantidad = item.Cantidad,
                    Subtotal = item.Subtotal
                }).ToList(),
                Total = carrito.Total
            };

            return Ok(carritoDto);
        }

        // Agregar producto al carrito
        [HttpPost("agregar")]
        public async Task<IActionResult> AgregarProductoAlCarrito([FromBody] CarritoItemAgregarDto itemDto)
        {
            string correoUsuario = ObtenerCorreoUsuario();
            var usuario = await _userRepository.ObtenerPorCorreoAsync(correoUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var producto = await _productoRepository.ObtenerPorIdAsync(itemDto.LibroId);
            if (producto == null)
            {
                return NotFound(new { error = "El producto especificado no se encuentra disponible." });
            }

            if (producto.Stock < itemDto.Cantidad)
            {
                return BadRequest(new { error = "No hay suficiente stock para completar la acción.", stockDisponible = producto.Stock });
            }

            var carritoUsuario = await _carritoRepository.ObtenerOCrearCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carritoUsuario == null)
            {
                return BadRequest(new { error = "Error al crear o recuperar el carrito del usuario." });
            }

            await _carritoRepository.AgregarProductoAlCarritoAsync(carritoUsuario, itemDto.LibroId, itemDto.Cantidad);
            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "El producto se ha añadido al carrito exitosamente." });
        }

        // Eliminar producto del carrito
        [HttpDelete("eliminar/{idProducto}")]
        public async Task<IActionResult> EliminarProductoDelCarrito(int idProducto, string correo = null)
        {
            string correoUsuario = correo ?? ObtenerCorreoUsuario();
            var usuario = await _userRepository.ObtenerPorCorreoAsync(correoUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
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
        [HttpDelete("vaciar")]
        [AllowAnonymous]
        public async Task<IActionResult> VaciarCarrito(string correo = null)
        {
            string correoUsuario = correo ?? ObtenerCorreoUsuario();
            var usuario = await _userRepository.ObtenerPorCorreoAsync(correoUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carritoUsuario == null)
            {
                return NotFound(new { error = "No existe un carrito asociado al usuario." });
            }

            await _carritoRepository.VaciarCarritoAsync(carritoUsuario);
            await _carritoRepository.GuardarCambiosAsync();

            return Ok(new { success = true, message = "El carrito se ha vaciado correctamente." });
        }
    }
}
