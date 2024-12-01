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

    // Crear un nuevo usuario
    [HttpPost("usuarios")]
    public IActionResult CrearUsuario([FromBody] User usuario)
    {
        if (ModelState.IsValid)
        {
            _context.Users.Add(usuario);
            _context.SaveChanges();
            return Ok(usuario);
        }
        return BadRequest(ModelState);
    }

    // Editar un usuario existente
    [HttpPut("usuarios/{id}")]
    public IActionResult EditarUsuario(int id, [FromBody] User usuarioActualizado)
    {
        var usuario = _context.Users.Find(id);
        if (usuario == null) return NotFound();

        usuario.Nombre = usuarioActualizado.Nombre;
        usuario.Apellidos = usuarioActualizado.Apellidos;
        usuario.Email = usuarioActualizado.Email;
        usuario.Direccion = usuarioActualizado.Direccion;
        usuario.Rol = usuarioActualizado.Rol;

        _context.SaveChanges();
        return Ok(usuario);
    }

    // Eliminar un usuario
    [HttpDelete("usuarios/{id}")]
    public IActionResult EliminarUsuario(int id)
    {
        var usuario = _context.Users.Find(id);
        if (usuario == null) return NotFound();

        _context.Users.Remove(usuario);
        _context.SaveChanges();
        return NoContent();
    }
}