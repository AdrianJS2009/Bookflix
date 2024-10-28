using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Bookflix_Server.Data;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Bookflix_Server;

public class Program
{
    public static void Main(string[] args)
    {
       
        var builder = WebApplication.CreateBuilder(args);

      
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();

        // Configurar CORS para permitir el acceso desde el frontend
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000") // Reemplaza con la URL de tu frontend en producción
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

        // Configurar el middleware
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("AllowFrontend"); // Permitir CORS en desarrollo
        }

        // Redirigir automáticamente las solicitudes HTTP a HTTPS
        app.UseHttpsRedirection();
        app.UseAuthentication(); // Habilitar autenticación JWT
        app.UseAuthorization();
        app.MapControllers();


        app.Run();
    }
}
