using Bookflix_Server.Data;
using Bookflix_Server.Models.Seeder;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace Bookflix_Server;


public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Cargar configuración de appsettings.json
        builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

        // Configuración de servicios
        ConfigureServices(builder);

        var app = builder.Build();

        // Inicialización de la base de datos y ejecución del seeder
        await InitializeDatabaseAsync(app);

        // Configuración del middleware
        ConfigureMiddleware(app);

        await app.RunAsync();
    }

    private static void ConfigureServices(WebApplicationBuilder builder)
    {
        // Servicios de controladores y Swagger
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bookflix API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Ingrese 'Bearer' seguido de su token JWT",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
        });

        // Configuración de la bbdd
        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Dependencias
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
        builder.Services.AddScoped<IReseñasRepository, ReseñasRepository>();

        // Configuración de CORS solo para el entorno de desarrollo
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
        }

        // Configuración de autenticación JWT
        ConfigureJwtAuthentication(builder);
    }

    private static void ConfigureJwtAuthentication(WebApplicationBuilder builder)
    {
        string key = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");

        if (string.IsNullOrEmpty(key))
        {
            throw new ArgumentNullException("Jwt:Key", "La clave JWT no está configurada en appsettings.");
        }

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });
    }

    private static async Task InitializeDatabaseAsync(WebApplication app)
    {
        using (IServiceScope scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            if (dbContext == null)
            {
                throw new Exception("MyDbContext no está registrado correctamente.");
            }

            dbContext.Database.EnsureCreated();

            // Ejecutar el seeder de libros
            var seeder = new SeederLibros(dbContext);
            await seeder.Seeder();
        }
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        // Configuración de Swagger
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookflix API V1");
                c.RoutePrefix = string.Empty;
            });
        }

        // Configuración de CORS
        app.UseCors(policy =>
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod());

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}