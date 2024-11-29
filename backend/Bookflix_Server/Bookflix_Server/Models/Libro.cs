using Bookflix_Server.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public ICollection<Reseña> Reseñas { get; set; } = new List<Reseña>();

    [NotMapped]
    public double PromedioEstrellas => Reseñas.Any() ? Reseñas.Average(r => r.Estrellas) : 0;

    [NotMapped]
    public int NumeroReseñas => Reseñas.Count;
}
