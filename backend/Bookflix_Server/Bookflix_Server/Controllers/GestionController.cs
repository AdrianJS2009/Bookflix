using Microsoft.AspNetCore.Mvc;
using Bookflix_Server.Models;
using Bookflix_Server.Data;
using Microsoft.AspNetCore.Authorization;
namespace Bookflix_Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class GestionController : ControllerBase
{
    private readonly MyDbContext _context;

    public GestionController(MyDbContext context)
    {
        _context = context;
    }

    // Crear un nuevo libro
    [HttpPost("libros")]
    public IActionResult CrearLibro([FromBody] Libro libro)
    {
        if (ModelState.IsValid)
        {
            _context.Libros.Add(libro);
            _context.SaveChanges();
            return Ok(libro);
        }
        return BadRequest(ModelState);
    }

    // Editar un libro existente
    [HttpPut("libros/{id}")]
    public IActionResult EditarLibro(int id, [FromBody] Libro libroActualizado)
    {
        var libro = _context.Libros.Find(id);
        if (libro == null) return NotFound();

        libro.Nombre = libroActualizado.Nombre;
        libro.Precio = libroActualizado.Precio;
        libro.UrlImagen = libroActualizado.UrlImagen;
        libro.Genero = libroActualizado.Genero;
        libro.Descripcion = libroActualizado.Descripcion;
        libro.Stock = libroActualizado.Stock;
        libro.Autor = libroActualizado.Autor;
        libro.ISBN = libroActualizado.ISBN;

        _context.SaveChanges();
        return Ok(libro);
    }

    // Editar un usuario existente
    [HttpPut("usuarios/{id}")]
    public IActionResult CambiarRol(int id)
    {
        var usuario = _context.Users.Find(id);
        if (usuario == null) return NotFound();
        
        if (usuario.Rol.Equals("admin"))
        {
            usuario.Rol = "usuario";

        } else if (usuario.Rol.Equals("usuario"))
        {
            usuario.Rol = "admin";

        } else
        {
            usuario.Rol = "usuario";
        }

            _context.SaveChanges();
        return Ok(usuario);
    }

    // Eliminar un usuario
    [HttpDelete("usuarios/{id}")]
    public IActionResult EliminarUsuario(int id)
    {
        var usuario = _context.Users.Find(id);
        if (usuario == null) return NotFound(new { error = "Usuario no encontrado." });

        _context.Users.Remove(usuario);
        _context.SaveChanges();
        return Ok(new { message = "Usuario eliminado correctamente." });
    }
}