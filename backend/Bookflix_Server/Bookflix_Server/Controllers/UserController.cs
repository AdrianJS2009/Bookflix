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

        [HttpGet("ListarUsuarios")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpGet("Detalle/{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            return Ok(user);
        }

        [HttpPost("Crear")]
        public async Task<ActionResult<User>> PostUser(UserDTO userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Datos del usuario no válidos.");

            var user = new User
            {
                Nombre = userDto.Nombre,
                Apellidos = userDto.Apellidos,
                Email = userDto.Email,
                Direccion = userDto.Direccion,
                Rol = userDto.Rol,
                Password = userDto.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.IdUser }, user);
        }

        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> PutUser(int id, UserDTO userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Usuario no encontrado.");

            if (!ModelState.IsValid)
                return BadRequest("Datos de usuario no válidos.");

            user.Nombre = userDto.Nombre;
            user.Apellidos = userDto.Apellidos;
            user.Email = userDto.Email;
            user.Direccion = userDto.Direccion;
            user.Rol = userDto.Rol;
            user.Password = userDto.Password;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound("Usuario no encontrado.");
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Usuario no encontrado.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Publicar una reseña
        [HttpPost("AgregarReseña")]
        public async Task<IActionResult> AgregarReseña([FromBody] ReseñaDTO reseñaDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = await _context.Users.Include(u => u.Reseñas).FirstOrDefaultAsync(u => u.IdUser == userId);
            if (user == null)
                return Unauthorized("Usuario no autenticado.");

            var producto = await _context.Libros.FindAsync(reseñaDto.ProductoId);
            if (producto == null)
                return NotFound("Producto no encontrado.");

            var existingReseña = user.Reseñas.FirstOrDefault(r => r.ProductoId == reseñaDto.ProductoId);
            if (existingReseña != null)
                return BadRequest("Ya has publicado una reseña para este producto.");

            var reseña = new Reseña
            {
                UsuarioId = userId,
                Autor = user.Nombre,
                ProductoId = reseñaDto.ProductoId,
                Texto = reseñaDto.Texto,
                Estrellas = reseñaDto.Estrellas,
                FechaPublicacion = DateTime.Now
            };

            _context.Reseñas.Add(reseña);
            await _context.SaveChangesAsync();

            return Ok("Reseña publicada con éxito.");
        }

        // Actualizar una reseña
        [HttpPut("ActualizarReseña/{id}")]
        public async Task<IActionResult> ActualizarReseña(int id, [FromBody] ReseñaDTO reseñaDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var reseña = await _context.Reseñas.FirstOrDefaultAsync(r => r.IdReseña == id && r.UsuarioId == userId);
            if (reseña == null)
                return NotFound("Reseña no encontrada o el usuario no tiene permiso para editarla.");

            reseña.Texto = reseñaDto.Texto;
            reseña.Estrellas = reseñaDto.Estrellas;
            reseña.FechaPublicacion = DateTime.Now;

            _context.Entry(reseña).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Reseña actualizada con éxito.");
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.IdUser == id);
        }
    }
}
