using Bookflix_Server.Data;
using Bookflix_Server.Models;
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

        // Listar todos los usuarios
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<User>>> ListarUsuarios()
        {
            var usuarios = await _context.Users.ToListAsync();
            return Ok(usuarios);
        }

        // Obtener un usuario por ID
        [HttpGet("detalle/{idUsuario}")]
        public async Task<ActionResult<User>> ObtenerUsuarioPorId(int idUsuario)
        {
            var usuario = await _context.Users.FindAsync(idUsuario);
            if (usuario == null)
            {
                return NotFound(new { error = "El usuario especificado no fue encontrado." });
            }

            return Ok(usuario);
        }

        // Crear un nuevo usuario
        [HttpPost("crear")]
        public async Task<ActionResult<User>> CrearUsuario([FromBody] UserDTO datosUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });

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

            return CreatedAtAction(nameof(ObtenerUsuarioPorId), new { idUsuario = usuario.IdUser }, usuario);
        }

        // Actualizar un usuario existente
        [HttpPut("actualizar/{idUsuario}")]
        public async Task<IActionResult> ActualizarUsuario(int idUsuario, [FromBody] UserDTO datosUsuario)
        {
            var usuario = await _context.Users.FindAsync(idUsuario);
            if (usuario == null)
            {
                return NotFound(new { error = "El usuario especificado no fue encontrado." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Los datos proporcionados para el usuario no son válidos." });
            }

            usuario.Nombre = datosUsuario.Nombre;
            usuario.Apellidos = datosUsuario.Apellidos;
            usuario.Email = datosUsuario.Email;
            usuario.Direccion = datosUsuario.Direccion;
            usuario.Rol = datosUsuario.Rol;
            usuario.Password = datosUsuario.Password;

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExiste(idUsuario))
                {
                    return NotFound(new { error = "El usuario especificado no fue encontrado." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Eliminar un usuario
        [HttpDelete("eliminar/{idUsuario}")]
        public async Task<IActionResult> EliminarUsuario(int idUsuario)
        {
            var usuario = await _context.Users.FindAsync(idUsuario);
            if (usuario == null)
            {
                return NotFound(new { error = "El usuario especificado no fue encontrado." });
            }

            _context.Users.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "El usuario ha sido eliminado exitosamente." });
        }

        // Publicar una reseña
        [HttpPost("publicar-resena")]
        public async Task<IActionResult> PublicarResena([FromBody] ReseñaDTO datosResena)
        {
            var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var usuario = await _context.Users.Include(u => u.Reseñas).FirstOrDefaultAsync(u => u.IdUser == idUsuario);
            if (usuario == null)
            {
                return Unauthorized(new { error = "Usuario no autenticado." });
            }

            var producto = await _context.Libros.FindAsync(datosResena.ProductoId);
            if (producto == null)
            {
                return NotFound(new { error = "El producto especificado no fue encontrado." });
            }

            var resenaExistente = usuario.Reseñas.FirstOrDefault(r => r.ProductoId == datosResena.ProductoId);
            if (resenaExistente != null)
            {
                return BadRequest(new { error = "Ya has publicado una reseña para este producto." });
            }

            var resena = new Reseña
            {
                UsuarioId = idUsuario,
                Autor = usuario.Nombre,
                ProductoId = datosResena.ProductoId,
                Texto = datosResena.Texto,
                Estrellas = datosResena.Estrellas,
                FechaPublicacion = DateTime.UtcNow
            };

            _context.Reseñas.Add(resena);
            await _context.SaveChangesAsync();

            return Ok(new { message = "La reseña ha sido publicada exitosamente." });
        }

        // Modificar una reseña existente
        [HttpPut("modificar-resena/{idResena}")]
        public async Task<IActionResult> ModificarResena(int idResena, [FromBody] ReseñaDTO datosResena)
        {
            var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var resena = await _context.Reseñas.FirstOrDefaultAsync(r => r.IdReseña == idResena && r.UsuarioId == idUsuario);
            if (resena == null)
            {
                return NotFound(new { error = "La reseña no existe o el usuario no tiene permiso para modificarla." });
            }

            resena.Texto = datosResena.Texto;
            resena.Estrellas = datosResena.Estrellas;
            resena.FechaPublicacion = DateTime.UtcNow;

            _context.Entry(resena).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "La reseña ha sido modificada exitosamente." });
        }

        // Verificar existencia de un usuario
        private bool UsuarioExiste(int idUsuario)
        {
            return _context.Users.Any(e => e.IdUser == idUsuario);
        }
    }
}
