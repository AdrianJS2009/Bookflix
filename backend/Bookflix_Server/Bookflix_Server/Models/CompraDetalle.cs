using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bookflix_Server.Models
{
    public class CompraDetalle
    {
        [Key]
        public int IdDetalle { get; set; }

        [Required]
        public int CompraId { get; set; }

        [ForeignKey("CompraId")]
        public Compra Compra { get; set; }

        [Required]
        public int LibroId { get; set; }

        [ForeignKey("LibroId")]
        public Libro Libro { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        public decimal PrecioUnitario { get; set; }
    }
}