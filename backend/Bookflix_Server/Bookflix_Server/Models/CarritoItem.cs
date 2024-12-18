﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Bookflix_Server.Models;

public class CarritoItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CarritoId { get; set; }

    [ForeignKey("CarritoId")]
    public Carrito Carrito { get; set; }

    [Required]
    public int IdLibro { get; set; }

    [ForeignKey("IdLibro")]
    public Libro Libro { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1")]
    public int Cantidad { get; set; }

    [NotMapped]
    public int Subtotal => (Libro?.Precio ?? 0) * Cantidad;

    public bool Comprado { get; set; }
}
