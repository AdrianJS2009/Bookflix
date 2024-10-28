using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Bookflix_Server.Data;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;


namespace Bookflix_Server;

public class Program
{
    public static void Main(string[] args)
    {
       
        var builder = WebApplication.CreateBuilder(args);

      
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        //builder.Services.AddSwaggerGen();


        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();

        // Configurar CORS para permitir el acceso desde el frontend
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000") // Reemplazable
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        // Configurar autenticación JWT
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                string key = builder.Configuration["Jwt:Key"];

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });

        var app = builder.Build();


        using (IServiceScope scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetService<MyDbContext>();
            dbContext.Database.EnsureCreated();
        }


        // Redirigir automáticamente las solicitudes HTTP a HTTPS
        app.UseHttpsRedirection();
        app.UseAuthentication(); // Habilitar autenticación JWT
        app.UseAuthorization();
        app.MapControllers();


        app.Run();
    }
}
