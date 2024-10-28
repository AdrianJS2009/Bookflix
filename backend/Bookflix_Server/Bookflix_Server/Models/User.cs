using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]   // Defino la clave primaria
    public int IdUser { get; set; }

    [Required]  // Defino los campos de nombre, apellidos, email, dirección y rol
    public string Nombre { get; set; }

    [Required]
    public string Apellidos { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Direccion { get; set; }

    [Required]
    [DefaultValue("usuario")]   // Defino el campo Rol con un valor por defecto de "usuario"
    public string Rol { get; set; } = "usuario";
}
