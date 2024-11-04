using System;

namespace Bookflix_Server.Models;

// Clase que representa una reseña individual
public class Reseña
{
    public int Id { get; set; } // Identificador único de la reseña
    public string Autor { get; set; } // Nombre del autor de la reseña
    public string Texto { get; set; } // Texto de la reseña
    public int Estrellas { get; set; } // Número de estrellas otorgadas en la reseña
    public DateTime FechaPublicacion { get; set; } // Fecha de publicación de la reseña
}

