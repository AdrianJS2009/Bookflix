using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

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

    public int ISBN { get; set; }

    public string Autor { get; set; }

    public ICollection<Reseñas> Reseñas { get; set; }
}

