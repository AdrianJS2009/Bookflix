using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Bookflix_Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bookflix_Server.Data;

namespace Bookflix_Server.Controllers
{
    internal class LibroController : ControllerBase
    {
        private readonly MyDbContext _context;

        public LibroController(MyDbContext context)
        {
            _context = context;
        }

        // GET para obtener todos los libros con filtros que se nos pide
        [HttpGet("ListarLibros")]
        public async Task<ActionResult<IEnumerable<Libro>>> GetLibros(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true,
            int pagina = 1,
            int tamanoPagina = 10)
        {
            var librosQuery = _context.Libros
                .Where(l =>
                    (autor == null || l.Autor.Contains(autor)) &&
                    (genero == null || l.Genero.Contains(genero)) &&
                    (isbn == null || l.ISBN == isbn) &&
                    (precioMin == null || l.Precio >= precioMin) &&
                    (precioMax == null || l.Precio <= precioMax));

            if (ordenPor == "precio")
            {
                librosQuery = ascendente ? librosQuery.OrderBy(l => l.Precio) : librosQuery.OrderByDescending(l => l.Precio);
            }
            else
            {
                librosQuery = ascendente ? librosQuery.OrderBy(l => l.Nombre) : librosQuery.OrderByDescending(l => l.Nombre);
            }

            //Paginación
            var libros = await librosQuery
                .Skip((pagina - 1) * tamanoPagina)
                .Take(tamanoPagina)
                .ToListAsync();

            return Ok(libros);
        }


        [HttpGet("Detalle/{id}")]
        public async Task<ActionResult<Libro>> GetLibroById(int id)
        {
            var libro = await _context.Libros.FirstOrDefaultAsync(l => l.IdLibro == id);
            if (libro == null)
            {
                return NotFound();
            }
            return Ok(libro);
        }

    }
}
