using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int IdUser { get; set; }

    [Required]  // Campo obligatorio
    public string Nombre { get; set; }

    [Required]  // Campo obligatorio
    public string Apellidos { get; set; }

    [Required]  // Campo obligatorio
    [EmailAddress]  // Validación de correo electrónico
    public string Email { get; set; }

    public string Direccion { get; set; }

    [Required]
    public string Rol { get; set; } = "usuario";

    [Required]  // Campo obligatorio
    public string Password { get; set; }
}
