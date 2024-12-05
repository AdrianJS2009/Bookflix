using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models.DTOs
{
    public class CarritoItemAgregarDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "El idLibro debe ser un número positivo.")]
        public int IdLibro { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Cantidad { get; set; }
    }
}
