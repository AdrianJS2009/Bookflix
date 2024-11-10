using Bookflix_Server.Models;
using System.ComponentModel.DataAnnotations;

public class Libro
{
    [Key]
    public int IdLibro { get; set; }

    [Required, StringLength(100)]
    public string Nombre { get; set; }

    [Required]
    public int Precio { get; set; }

    [Required]
    public string UrlImagen { get; set; }

    public string Genero { get; set; }
    public string Descripcion { get; set; }
    public int Stock { get; set; }
    public string ISBN { get; set; }
    public string Autor { get; set; }

    // Inicializa las reseñas para que no estén a null
    public ICollection<Reseña> Reseñas { get; set; } = new List<Reseña>();
}
