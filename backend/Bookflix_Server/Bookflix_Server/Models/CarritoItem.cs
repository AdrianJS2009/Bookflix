using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models;
public class CarritoItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int LibroId { get; set; }

    [ForeignKey("LibroId")]
    public Libro Libro { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1")]
    public int Cantidad { get; set; }

    [NotMapped]
    public int Subtotal => Libro?.Precio * Cantidad ?? 0;
}
