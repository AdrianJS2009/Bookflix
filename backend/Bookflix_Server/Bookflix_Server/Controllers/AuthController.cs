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
        //[HttpPost("login")]
        //public async Task<ActionResult<string>> Login([FromBody] LoginDto model)
        //{
        //    // Usuario temporal para pruebas
        //    var tempUserName = "string";
        //    var tempPassword = "string";

        //    // Comprobar el usuario y la contraseña
        //    if (model.UserName != tempUserName || model.Password != tempPassword)
        //    {
        //        return Unauthorized(); // Si no coincide, devuelve 401
        //    }

        //    // Crear el token para el usuario temporal
        //    var token = GenerateToken(tempUserName);
        //    return Ok(token);
        //}
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto model)
        {
            // Buscar el usuario en la base de datos por el email
            var user = await _unitOfWork.Users.GetByEmailAsync(model.Email); // Supón que existe un método GetByEmailAsync en el repositorio

            // Verificar si el usuario existe y la contraseña coincide
            if (user == null || user.Password != model.Password) // Asegúrate de que la contraseña esté encriptada si es necesario
            {
                return Unauthorized(); // Devuelve 401 si las credenciales no son válidas
            }

            // Crear el token para el usuario
            var token = GenerateToken(user.Email);
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
