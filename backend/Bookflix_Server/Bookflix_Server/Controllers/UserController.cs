﻿using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Bookflix_Server.Models.DTOs;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IReseñasRepository _reseñaRepository;
        private readonly IProductoRepository _productoRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICompraRepository _compraRepository;
        private readonly IPasswordHasher _passwordHasher;


        public UserController(MyDbContext context, IReseñasRepository reseñaRepository, IProductoRepository productoRepository, IUserRepository userRepository, ICompraRepository compraRepository, IPasswordHasher passwordHasher)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _reseñaRepository = reseñaRepository ?? throw new ArgumentNullException(nameof(reseñaRepository));
            _productoRepository = productoRepository ?? throw new ArgumentNullException(nameof(productoRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _compraRepository = compraRepository ?? throw new ArgumentException(nameof(compraRepository));
            _passwordHasher = passwordHasher;
        }

        private string ObtenerIdUsuario()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        [HttpGet("listar")]
        public async Task<IActionResult> ListarUsuarios(int pagina = 1, int tamanoPagina = 10)
        {
            if (pagina <= 0 || tamanoPagina <= 0)
                return BadRequest(new { error = "Parámetros de paginación inválidos." });


            var usuariosQuery = _context.Users.AsQueryable();

            var totalUsuarios = await usuariosQuery.CountAsync();
            var totalPaginas = (int)Math.Ceiling(totalUsuarios / (double)tamanoPagina);

            var usuarios = await usuariosQuery
                .Skip((pagina - 1) * tamanoPagina)
                .Take(tamanoPagina)
                .Select(u => new
                {
                    u.IdUser,
                    u.Nombre,
                    u.Email,
                    u.Rol
                })
                .ToListAsync();

            return Ok(new
            {
                usuarios,
                totalUsuarios,
                totalPaginas
            });
        }

        [HttpGet("perfil")]
        [Authorize]
        public async Task<ActionResult<User>> ObtenerPerfilUsuario()
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.IdUser == idUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            var carrito = await _context.Carritos.FirstOrDefaultAsync(c => c.UserId == usuario.IdUser);
            if (carrito == null)
            {
                carrito = new Carrito
                {
                    UserId = usuario.IdUser,
                    Items = new List<CarritoItem>()
                };
                _context.Carritos.Add(carrito);
                await _context.SaveChangesAsync();
            }

            return Ok(usuario);
        }


        [HttpPost("crear")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> CrearUsuario([FromBody] UserDTO datosUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });

            var usuarioExistente = await _userRepository.ObtenerPorCorreoAsync(datosUsuario.Email);
            if (usuarioExistente != null)
            {
                return Conflict(new { error = "El correo electrónico ya está en uso." });
            }

            var usuario = new User
            {
                Nombre = datosUsuario.Nombre,
                Apellidos = datosUsuario.Apellidos,
                Email = datosUsuario.Email,
                Direccion = datosUsuario.Direccion,
                Rol = datosUsuario.Rol,
                Password = _passwordHasher.HashPassword(datosUsuario.Password)
            };


            // Console.WriteLine($"Hash generado para el usuario {usuario.Email}: {usuario.Password}");


            await _userRepository.AgregarUsuarioAsync(usuario);

            return CreatedAtAction(nameof(ObtenerPerfilUsuario), new { correo = usuario.Email }, new
            {
                usuario.IdUser,
                usuario.Nombre,
                usuario.Email,
                usuario.Direccion,
                usuario.Rol
            });
        }



        [HttpPut("actualizar")]
        [Authorize]
        public async Task<IActionResult> ActualizarPerfilUsuario([FromBody] UserDTO datosUsuario)
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.IdUser == idUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });
            }


            usuario.Nombre = datosUsuario.Nombre;
            usuario.Apellidos = datosUsuario.Apellidos;
            usuario.Direccion = datosUsuario.Direccion;


            if (!string.IsNullOrEmpty(datosUsuario.Password))
            {
                usuario.Password = _passwordHasher.HashPassword(datosUsuario.Password);
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }


        [HttpDelete("eliminar")]
        [Authorize]
        public async Task<IActionResult> EliminarCuentaUsuario()
        {
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.IdUser == idUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            _context.Users.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "La cuenta del usuario ha sido eliminada exitosamente." });
        }

        [HttpPost("publicar")]
        [Authorize]
        public async Task<IActionResult> PublicarReseña([FromBody] ReseñaDTO reseñaDto)
        {
            if (reseñaDto == null)
                return BadRequest(new { error = "Datos de la reseña no proporcionados." });

            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            if (!int.TryParse(reseñaDto.IdLibro, out int idLibro))
                return BadRequest(new { error = "ID del libro no es válido." });

            var libro = await _productoRepository.ObtenerPorIdAsync(idLibro);
            if (libro == null)
                return NotFound(new { error = "Libro no encontrado." });


            if (await _reseñaRepository.UsuarioHaReseñadoProductoAsync(idUsuario, idLibro))
            {
                return Conflict(new { error = "Ya has reseñado este producto." });
            }

            var reseña = new Reseña
            {
                UsuarioId = usuario.IdUser,
                ProductoId = idLibro,
                Autor = !string.IsNullOrEmpty(reseñaDto.Autor)
                    ? reseñaDto.Autor
                    : $"{usuario.Nombre} {usuario.Apellidos}",
                Estrellas = reseñaDto.Estrellas,
                Texto = reseñaDto.Texto,
                FechaPublicacion = reseñaDto.FechaPublicacion != default ? reseñaDto.FechaPublicacion : DateTime.UtcNow,
                Categoria = reseñaDto.Categoria,
            };

            await _reseñaRepository.AgregarAsync(reseña);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Reseña publicada exitosamente.",
                nombreUsuario = reseña.Autor,
                fechaPublicacion = reseña.FechaPublicacion
            });
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
                    IdLibro = detalle.IdLibro,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario
                }).ToList()
            }).ToList();

            return Ok(historialComprasDto);
        }
        [HttpGet("verificar-compra")]
        public async Task<IActionResult> VerificarCompra(int idUsuario, int idLibro)
        {
            var compraDetalle = await _compraRepository.ObtenerCompraPorUsuarioYProductoAsync(idUsuario, idLibro);

            if (compraDetalle == null)
            {
                return BadRequest(new { error = "No has comprado este producto. No puedes dejar una reseña." });
            }

            return Ok(new { success = true });
        }

    }
}
