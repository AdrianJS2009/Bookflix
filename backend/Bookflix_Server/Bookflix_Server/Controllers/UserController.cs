using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bookflix_Server.Data;

namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly MyDbContext _context;


        public UserController(MyDbContext context)
        {
            _context = context;
        }

        // GET para obtener todos los usuarios
        [HttpGet("ListarUsuarios")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Recibimos la lista de usuarios de la base de datos
            return await _context.Users.ToListAsync();
        }

        // GET para obtener un usuario por su ID
        [HttpGet("Detalle/{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            // Buscamos el usuario en la base de datos por su ID
            var user = await _context.Users.FindAsync(id);

            // Si el usuario no existe, devuelve un código 404 (Not Found)
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST para crear un nuevo usuario
        [HttpPost("Crear")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.IdUser }, user);
        }


        // PUT para actualizar un usuario existente
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            // Verifica que el ID del usuario coincida con el ID de la solicitud
            if (id != user.IdUser)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                // Guarda los cambios en la base de datos
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Si el usuario no existe, devuelve un código 404 (Not Found)
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Devuelve un código 204 si el proceso se ha hecho bien
            return NoContent();
        }

        // DELETE para eliminar un usuario por su ID
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Busca el usuario en la base de datos por su ID
            var user = await _context.Users.FindAsync(id);
            // Si el usuario no existe, devuelve 404 (Not Found)
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            // Devuelve 204 (No Content) si el proceso ha ido bien
            return NoContent();
        }

        // Verificamos si el id del usuario está en la bbdd
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.IdUser == id);
        }
    }
}
