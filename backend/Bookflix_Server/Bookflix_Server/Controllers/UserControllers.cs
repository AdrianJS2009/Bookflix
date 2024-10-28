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
    }
}
