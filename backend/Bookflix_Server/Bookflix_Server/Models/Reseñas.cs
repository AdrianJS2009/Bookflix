using System;
using System.Collections.Generic;
using System.Linq;

namespace Bookflix_Server.Models;

// Clase que representa una reseña individual
internal class Reseña
{
    // Propiedades de la reseña
    public string Autor { get; set; } // Nombre del autor de la reseña
    public string Texto { get; set; } // Texto de la reseña
    public int Estrellas { get; set; } // Número de estrellas otorgadas en la reseña
    public DateTime FechaPublicacion { get; set; } // Fecha de publicación de la reseña
}

// Clase que maneja una colección de reseñas
internal class Reseñas
{
    // Lista privada que almacena las reseñas
    private List<Reseña> listaReseñas = new List<Reseña>();

    // Método para agregar una nueva reseña a la lista
    public void AgregarReseña(Reseña reseña)
    {
        listaReseñas.Add(reseña);
    }
}
