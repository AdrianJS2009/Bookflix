using Bookflix_Server.Data;
using Bookflix_Server.Models;
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

        public UserController(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        private string ObtenerCorreoUsuario()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value; // Extraer el correo del token
        }

        // Listar todos los usuarios
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<User>>> ListarUsuarios()
        {
            var usuarios = await _context.Users.ToListAsync();
            return Ok(usuarios);
        }

        // Obtener el perfil del usuario autenticado o por correo
        [HttpGet("perfil")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> ObtenerPerfilUsuario(string correo = null)
        {
            // Si no se especifica correo, se usa el del usuario autenticado
            string correoUsuario = correo ?? ObtenerCorreoUsuario();
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.Email == correoUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            return Ok(usuario);
        }

        // Crear un nuevo usuario (incluye verificación de unicidad de correo)
        [HttpPost("crear")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> CrearUsuario([FromBody] UserDTO datosUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });

            // Verificar si ya existe un usuario con el mismo correo
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

            return CreatedAtAction(nameof(ObtenerPerfilUsuario), new { correo = usuario.Email }, usuario);
        }

        // Actualizar el perfil del usuario autenticado
        [HttpPut("actualizar")]
        [Authorize]
        public async Task<IActionResult> ActualizarPerfilUsuario([FromBody] UserDTO datosUsuario)
        {
            string correoUsuario = ObtenerCorreoUsuario();
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.Email == correoUsuario);

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

        // Eliminar la cuenta del usuario autenticado
        [HttpDelete("eliminar")]
        [Authorize]
        public async Task<IActionResult> EliminarCuentaUsuario()
        {
            string correoUsuario = ObtenerCorreoUsuario();
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.Email == correoUsuario);

            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            _context.Users.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "La cuenta del usuario ha sido eliminada exitosamente." });
        }
    }
}
