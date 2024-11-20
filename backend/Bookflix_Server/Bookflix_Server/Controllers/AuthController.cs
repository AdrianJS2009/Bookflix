using Bookflix_Server.Models;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

//namespace Bookflix_Server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AuthController : ControllerBase
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly IConfiguration _config;

//        public AuthController(IUnitOfWork unitOfWork, IConfiguration config)
//        {
//            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
//            _config = config ?? throw new ArgumentNullException(nameof(config));
//        }

//        [HttpPost("iniciar-sesion")]
//        public async Task<ActionResult<string>> IniciarSesion([FromBody] LoginDto modelo)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest("Los datos proporcionados no son válidos.");

//            var usuario = await _unitOfWork.Users.ObtenerPorCorreoAsync(modelo.Email);

//            if (usuario == null || usuario.Password != modelo.Password)
//                return Unauthorized("Las credenciales son incorrectas.");

//            var token = GenerarToken(usuario);
//            return Ok(new { Token = token });
//        }

//        private string GenerarToken(User usuario)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.NameIdentifier, usuario.IdUser.ToString()),
//                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//                new Claim(ClaimTypes.Name, usuario.Nombre),
//                new Claim(ClaimTypes.Role, usuario.Rol)
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
//            var credenciales = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _config["Jwt:Issuer"],
//                audience: _config["Jwt:Audience"],
//                claims: claims,
//                expires: DateTime.Now.AddHours(1),
//                signingCredentials: credenciales);

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}


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
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol)
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
        public IActionResult ReadToken()
        {
            string email = ObtenerCorreoUsuario();
            return Ok(new { Email = email });
        }
    }
}
