using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authorization;
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

        public UserController(MyDbContext context, IReseñasRepository reseñaRepository, IProductoRepository productoRepository, IUserRepository userRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _reseñaRepository = reseñaRepository ?? throw new ArgumentNullException(nameof(reseñaRepository));
            _productoRepository = productoRepository ?? throw new ArgumentNullException(nameof(productoRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        private string ObtenerIdUsuario()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
        }

        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<User>>> ListarUsuarios()
        {
            var usuarios = await _context.Users.ToListAsync();
            return Ok(usuarios);
        }

        [HttpGet("perfil")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> ObtenerPerfilUsuario()
        {
            
            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.IdUser == idUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            return Ok(usuario);
        }

       
        [HttpPost("crear")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> CrearUsuario([FromBody] UserDTO datosUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });

      
            var usuarioExistente = await _context.Users.FirstOrDefaultAsync(u => u.Email == datosUsuario.Email);
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
                Password = datosUsuario.Password
            };

            _context.Users.Add(usuario);
            await _context.SaveChangesAsync();

          
            var carrito = new Carrito
            {
                UserId = usuario.IdUser,
                Items = new List<CarritoItem>() 
            };

            _context.Carritos.Add(carrito);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerPerfilUsuario), new { correo = usuario.Email }, usuario);
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
            usuario.Password = datosUsuario.Password;

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
        public async Task<IActionResult> PublicarReseña([FromBody] ReseñaDTO reseñaDto)
        {
            if (reseñaDto == null)
                return BadRequest(new { error = "Datos de la reseña no proporcionados." });

            int idUsuario = int.Parse(ObtenerIdUsuario());
            var usuario = await _userRepository.ObtenerPorIdAsync(idUsuario);

            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado." });

            if (!int.TryParse(reseñaDto.LibroId, out int libroId))
                return BadRequest(new { error = "ID del libro no es válido." });

            var libro = await _productoRepository.ObtenerPorIdAsync(libroId);
            if (libro == null)
                return NotFound(new { error = "Libro no encontrado." });

            var reseña = new Reseña
            {
                UsuarioId = usuario.IdUser,
                ProductoId = libroId, 
                Autor = !string.IsNullOrEmpty(reseñaDto.Autor)
                        ? reseñaDto.Autor
                        : $"{usuario.Nombre} {usuario.Apellidos}",
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


    }
}
