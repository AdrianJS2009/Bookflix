using Bookflix_Server.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int IdUser { get; set; }  

    [Required]
    public string Nombre { get; set; }  

    [Required]
    public string Apellidos { get; set; }  

    [Required]
    [EmailAddress]  
    public string Email { get; set; } 

    public string Direccion { get; set; }  

    [Required]
    public string Rol { get; set; } = "usuario";  

    [Required]
    public string Password { get; set; }  

    
    public ICollection<Reseña> Reseñas { get; set; } = new List<Reseña>();
}
