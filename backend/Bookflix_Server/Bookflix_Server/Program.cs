using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Bookflix_Server.Data;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
<<<<<<< HEAD
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
=======
using Microsoft.Extensions.Hosting;


>>>>>>> 75fbac7d84215b0fac4855428337c1fbb13c3013

namespace Bookflix_Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

<<<<<<< HEAD
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bookflix API", Version = "v1" });
        });
=======
        // Configurar controladores y Swagger para la documentación
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Configurar MyDbContext para usar SQLite
        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
>>>>>>> 75fbac7d84215b0fac4855428337c1fbb13c3013

        // Inyectar UnitOfWork y UserRepository
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();

        // Configuración de CORS para permitir solicitudes desde el frontend en desarrollo
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // Ajusta según el puerto de tu frontend
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
        }

        // Configuración de autenticación JWT
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                string key = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });

        // Registrar MyDbContext
        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite($"DataSource={AppDomain.CurrentDomain.BaseDirectory}bookflix.db"));

<<<<<<< HEAD
        var app = builder.Build();

        using (IServiceScope scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetService<MyDbContext>();
            if (dbContext == null)
            {
                throw new Exception("MyDbContext no está registrado correctamente en el contenedor de servicios.");
            }
            dbContext.Database.EnsureCreated();
        }

        // Redirigir automáticamente las solicitudes HTTP a HTTPS
=======
        // Asegurarse de que la base de datos esté creada
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            dbContext.Database.EnsureCreated();
        }

        // Configuración de middleware en entorno de desarrollo
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger(); // Habilitar Swagger para generar la documentación
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookflix API V1");
                c.RoutePrefix = string.Empty; // Hacer que Swagger esté en la raíz
            });

            app.UseCors("AllowFrontend"); // Permitir CORS en desarrollo
        }

>>>>>>> 75fbac7d84215b0fac4855428337c1fbb13c3013
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

<<<<<<< HEAD
        // Habilitar middleware de Swagger
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookflix API V1");
            c.RoutePrefix = string.Empty; // Para que Swagger UI esté en la raíz
        });

=======
        // Mapear las rutas de los controladores a los endpoints HTTP
>>>>>>> 75fbac7d84215b0fac4855428337c1fbb13c3013
        app.MapControllers();

        app.Run();
    }
}