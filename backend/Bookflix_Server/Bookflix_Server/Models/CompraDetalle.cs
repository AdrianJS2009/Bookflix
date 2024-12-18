﻿using System.ComponentModel.DataAnnotations;
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
        public Compras Compra { get; set; }

        [Required]
        public int IdLibro { get; set; }

        [ForeignKey("IdLibro")]
        public Libro Libro { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        public decimal PrecioUnitario { get; set; }
    }
}