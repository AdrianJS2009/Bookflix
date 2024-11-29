using Bookflix_Server.DTOs;
using Bookflix_Server.Models;
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
        private readonly ICompraRepository _compraRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CarritoController(
            ICarritoRepository carritoRepository,
            IProductoRepository productoRepository,
            IUserRepository userRepository,
            ICompraRepository compraRepository,
            IUnitOfWork unitOfWork)
        {
            _carritoRepository = carritoRepository;
            _productoRepository = productoRepository;
            _userRepository = userRepository;
            _compraRepository = compraRepository;
            _unitOfWork = unitOfWork;
        }

        private string ObtenerIdUsuario()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value; // Extraer el correo del token
        }

        [HttpGet("ListarCarrito")]
        public async Task<IActionResult> ObtenerCarrito(string correo = null)
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);

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
                    NombreLibro = item.Libro.Nombre,
                    Cantidad = item.Cantidad,
                    Subtotal = item.Subtotal,
                    UrlImagen = item.Libro.UrlImagen,
                    Precio = item.Libro.Precio
                }).ToList(),
                Total = carrito.Total
            };

            return Ok(carritoDto);
        }

        [HttpPost("agregar")]
        public async Task<IActionResult> AgregarProductoAlCarrito([FromBody] CarritoItemAgregarDto itemDto)
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);


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
                await _carritoRepository.AgregarProductoAlCarritoAsync(carritoUsuario, itemDto.LibroId, itemDto.Cantidad);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "El producto se ha añadido al carrito exitosamente." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocurrió un error inesperado.", detalle = ex.Message });
            }
        }

        [HttpDelete("eliminar/{idProducto}")]
        public async Task<IActionResult> EliminarProductoDelCarrito(int idProducto)
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

           
            var carritoUsuario = await _carritoRepository.ObtenerOCrearCarritoPorUsuarioIdAsync(usuario.IdUser);

            var productoEnCarrito = carritoUsuario.Items.FirstOrDefault(p => p.LibroId == idProducto);
            if (productoEnCarrito == null)
            {
                return NotFound(new { error = "El producto no se encuentra en el carrito." });
            }

            bool productoEliminado = await _carritoRepository.EliminarProductoDelCarritoAsync(carritoUsuario, idProducto);

            if (!productoEliminado)
            {
                return NotFound(new { error = "No se pudo eliminar el producto del carrito." });
            }

            return Ok(new { message = "Producto eliminado correctamente del carrito." });
        }

        [HttpDelete("vaciar")]
        public async Task<IActionResult> VaciarCarrito(string correo = null)
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);


            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carritoUsuario == null)
            {
                return NotFound(new { error = "No existe un carrito asociado al usuario." });
            }

            await _carritoRepository.VaciarCarritoAsync(carritoUsuario);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true, message = "El carrito se ha vaciado correctamente." });
        }

        [HttpPost("comprar")]
        public async Task<IActionResult> ComprarCarrito()
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);


            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var carritoUsuario = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carritoUsuario == null || !carritoUsuario.Items.Any())
                return NotFound(new { error = "El carrito está vacío." });

            var compra = new Compras
            {
                UsuarioId = usuario.IdUser,
                FechaCompra = DateTime.UtcNow
            };

            foreach (var item in carritoUsuario.Items)
            {
                if (!await _productoRepository.ReducirStockAsync(item.LibroId, item.Cantidad))
                {
                    return BadRequest(new { error = $"El producto '{item.LibroId}' no tiene suficiente stock." });
                }

                var detalle = new CompraDetalle
                {
                    LibroId = item.LibroId,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = item.Libro.Precio
                };

                compra.Detalles.Add(detalle);
            }

            await _compraRepository.RegistrarCompraAsync(compra);
            await _carritoRepository.VaciarCarritoAsync(carritoUsuario);

            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true, message = "Compra realizada exitosamente." });
        }

        [HttpGet("historial")]
        public async Task<IActionResult> ObtenerHistorialCompras()
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);


            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            var compras = await _compraRepository.ObtenerComprasPorUsuarioIdAsync(usuario.IdUser);

            if (compras == null || !compras.Any())
                return NotFound(new { error = "No se encontraron compras para este usuario." });

            var historialComprasDto = compras.Select(compra => new CompraDTO
            {
                IdCompra = compra.IdCompra,
                FechaCompra = compra.FechaCompra,
                Detalles = compra.Detalles.Select(detalle => new CompraDetalleDTO
                {
                    LibroId = detalle.LibroId,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario
                }).ToList()
            }).ToList();

            return Ok(historialComprasDto);
        }

        [HttpPut("ActualizarCantidad")]
        public async Task<IActionResult> ActualizarCantidadProducto([FromBody] CarritoItemActualizarDTO datos)
        {
            Console.WriteLine($"Actualizando cantidad: LibroId={datos.LibroId}, NuevaCantidad={datos.NuevaCantidad}");


            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);

            if (usuario == null)
            {
                Console.WriteLine("Usuario no encontrado.");
                return NotFound(new { error = "Usuario no encontrado." });
            }

            var carrito = await _carritoRepository.ObtenerCarritoPorUsuarioIdAsync(usuario.IdUser);
            if (carrito == null)
            {
                Console.WriteLine("Carrito no encontrado.");
                return NotFound(new { error = "Carrito no encontrado." });
            }

            bool actualizado = await _carritoRepository.ActualizarCantidadProductoAsync(carrito, datos.LibroId, datos.NuevaCantidad);
            if (!actualizado)
            {
                Console.WriteLine("No se pudo actualizar la cantidad.");
                return BadRequest(new { error = "No se pudo actualizar la cantidad." });
            }

            Console.WriteLine("Cantidad actualizada correctamente.");
            return Ok(new { message = "Cantidad actualizada correctamente." });
        }



    }
}
