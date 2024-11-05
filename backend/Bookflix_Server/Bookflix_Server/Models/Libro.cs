using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Bookflix_Server.Models;
public class Libro
{
    [Key]
    public int IdLibro { get; set; }

    [Required, StringLength(100), NotNull]
    public string Nombre { get; set; }

    [Required, NotNull]
    public decimal Precio { get; set; }

    [Required, NotNull]
    public string UrlImagen { get; set; }

    public string Genero { get; set; }

    public string Descripcion { get; set; }

    public int Stock { get; set; }

    public string ISBN { get; set; }

    public string Autor { get; set; }

    public ICollection<Reseña> Reseñas { get; set; }
}

