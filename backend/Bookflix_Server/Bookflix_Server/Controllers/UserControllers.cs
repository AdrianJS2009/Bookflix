using Microsoft.AspNetCore.Mvc;
using Bookflix_Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Controllers
{
    // Indica que esta clase es un controlador de API
    [ApiController]
    // Define la ruta base para las solicitudes HTTP
    [Route("api/[controller]")]
    public class UserControllers : ControllerBase
    {
        // Campo privado para el contexto de la base de datos
        private readonly BookflixContext _context;

        // Constructor que recibe el contexto de la base de datos a través de inyección de dependencias
        public UserControllers(BookflixContext context)
        {
            _context = context;
        }

        // Método GET para obtener todos los usuarios
        // GET: api/UserControllers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Devuelve la lista de usuarios de la base de datos
            return await _context.Users.ToListAsync();
        }

        // Método GET para obtener un usuario por su ID
        // GET: api/UserControllers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            // Busca el usuario en la base de datos por su ID
            var user = await _context.Users.FindAsync(id);

            // Si el usuario no existe, devuelve un código 404 (Not Found)
            if (user == null)
            {
                return NotFound();
            }

            // Devuelve el usuario encontrado
            return user;
        }

        // Método POST para crear un nuevo usuario
        // POST: api/UserControllers
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Añade el nuevo usuario al contexto
            _context.Users.Add(user);
            // Guarda los cambios en la base de datos
            await _context.SaveChangesAsync();

            // Devuelve el usuario creado con un código 201 (Created)
            return CreatedAtAction(nameof(GetUser), new { id = user.IdUser }, user);
        }

        // Método PUT para actualizar un usuario existente
        // PUT: api/UserControllers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            // Verifica que el ID del usuario coincida con el ID de la solicitud
            if (id != user.IdUser)
            {
                return BadRequest();
            }

            // Marca el usuario como modificado en el contexto
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
                    // Si ocurre otro error, lanza la excepción
                    throw;
                }
            }

            // Devuelve un código 204 (No Content) para indicar que la operación fue exitosa
            return NoContent();
        }

        
    }
}
