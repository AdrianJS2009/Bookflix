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
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public AuthController(IUnitOfWork unitOfWork, IConfiguration config)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto model)
        {
           
            if (!ModelState.IsValid)
                return BadRequest("Datos de inicio de sesión no válidos.");

            
            var user = await _unitOfWork.Users.GetByEmailAsync(model.Email);

          
            if (user == null || user.Password != model.Password)
                return Unauthorized("Credenciales incorrectas.");

           
            var token = GenerateToken(user);
            return Ok(new { Token = token });
        }

       
        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Nombre),
                new Claim(ClaimTypes.Role, user.Rol)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
