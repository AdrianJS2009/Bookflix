using Bookflix_Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (!ModelState.IsValid)
                return BadRequest("Datos del usuario no válidos.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.IdUser }, user);
        }

        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.IdUser)
                return BadRequest("El ID no coincide con el usuario a actualizar.");

            if (!ModelState.IsValid)
                return BadRequest("Datos de usuario no válidos.");

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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.IdUser == id);
        }
    }
}
