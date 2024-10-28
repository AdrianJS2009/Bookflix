using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models
{
    // Clase DTO que representa los datos de login enviados desde el cliente
    public class LoginDto
    {
        public string UserName { get; set; } // Nombre de usuario o email

        public string Password { get; set; } // Contraseña del usuario
    }
}
