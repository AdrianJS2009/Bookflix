using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int IdUser { get; set; }  // Identificador único del usuario

    [Required]
    public string Nombre { get; set; }  // Nombre del usuario

    [Required]
    public string Apellidos { get; set; }  // Apellidos del usuario

    [Required]
    [EmailAddress]  // Validación de formato de correo electrónico
    public string Email { get; set; }  // Correo electrónico del usuario (considerar restricción de unicidad)

    public string Direccion { get; set; }  // Dirección del usuario (opcional)

    [Required]
    public string Rol { get; set; } = "usuario";  // Rol del usuario, por defecto "usuario"

    [Required]
    public string Password { get; set; }  // Contraseña del usuario
}
