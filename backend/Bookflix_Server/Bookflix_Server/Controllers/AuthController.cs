﻿using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;




using Microsoft.AspNetCore.Authorization;


namespace Bookflix_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepository;

        public AuthController(IConfiguration config, IUserRepository userRepository)
        {
            _config = config;
            _userRepository = userRepository;
        }

        private string ObtenerCorreoUsuario()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value; // Extraer el correo del token
        }

        // Endpoint para generar y devolver el token JWT
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Datos de login inválidos." });

            var usuario = await _userRepository.ObtenerPorCorreoAsync(loginDto.Email);

            if (usuario == null || usuario.Password != loginDto.Password)
            {
                return Unauthorized(new { error = "Credenciales incorrectas." });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email), // Correo electrónico
                new Claim(ClaimTypes.NameIdentifier, usuario.IdUser.ToString()), // ID del usuario
                new Claim(ClaimTypes.Role, usuario.Rol) // Rol del usuario
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        // Endpoint para leer el contenido del token
        [HttpGet("read")]
        [Authorize]
        public IActionResult LeerToken()
        {
            string email = ObtenerCorreoUsuario();
            return Ok(new { Email = email });
        }

        [HttpGet("usuario")]
        [Authorize]
        public IActionResult ObtenerDetallesUsuario()
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(id))
            {
                return Unauthorized(new { error = "No se pudo determinar el usuario." });
            }

            return Ok(new { Id = id, Email = email });
        }

    }
}
