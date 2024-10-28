using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bookflix_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork; // UOW para entrar en los repos
        private readonly IConfiguration _config; // Config para utilizar claves JWT

        public AuthController(IUnitOfWork unitOfWork, IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _config = config;
        }

        // Endpoint
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto model)
        {
            // Comprobar el user en la BBDD
            var userExists = await _unitOfWork.Users.UserExistsAsync(model.UserName);
            if (!userExists || model.Password != "contraseña")
            {
                return Unauthorized(); // 
            }

            // Crear el token para el user
            var token = GenerateToken(model.UserName);
            return Ok(token);
        }

        // Genera el token JWT basado en las claims del usuario
        private string GenerateToken(string userName)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName), // Claim de nombre de usuario
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // ID único del token
                new Claim(ClaimTypes.Name, userName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(700),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
