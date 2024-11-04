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

    // Método para calcular el promedio de estrellas de todas las reseñas
    public double CalcularPromedioEstrellas()
    {
        // Si no hay reseñas, el promedio es 0
        if (listaReseñas.Count == 0)
            return 0;

        // Calcula el promedio de estrellas usando LINQ
        return listaReseñas.Average(r => r.Estrellas);
    }

    // Método para obtener el total de reseñas
    public int ObtenerTotalReseñas()
    {
        return listaReseñas.Count;
    }

    // Método para obtener los datos básicos de todas las reseñas
    public List<Reseña> ObtenerDatosBasicos()
    {
        // Selecciona y retorna una lista con los datos básicos de cada reseña
        return listaReseñas.Select(r => new Reseña
        {
            Autor = r.Autor,
            Texto = r.Texto,
            Estrellas = r.Estrellas,
            FechaPublicacion = r.FechaPublicacion
        }).ToList();
    }
}
