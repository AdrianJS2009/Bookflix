﻿using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models
{
    public class Compras
    {

        [Key]
        public int IdCompra { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        public User Usuario { get; set; }

        [Required]
        public DateTime FechaCompra { get; set; }

        public ICollection<CompraDetalle> Detalles { get; set; } = new List<CompraDetalle>();
    }
}