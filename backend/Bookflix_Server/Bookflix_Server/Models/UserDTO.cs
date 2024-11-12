namespace Bookflix_Server.Models
{
    public class UserDTO
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }
        public string Direccion { get; set; }
        public string Rol { get; set; } = "usuario";
        public string Password { get; set; }
    }
}
