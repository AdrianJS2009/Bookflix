using Bookflix_Server.Data;
using Bookflix_Server.Models.Seeder;
using Bookflix_Server.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Bookflix_Server.Services;

namespace Bookflix_Server;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

        ConfigureServices(builder);

        var app = builder.Build();

        await InitializeDatabaseAsync(app);

        ConfigureMiddleware(app);

        await app.RunAsync();
    }



    private static void ConfigureServices(WebApplicationBuilder builder)
    {
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




        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
        builder.Services.AddScoped<IReseñasRepository, ReseñasRepository>();
        builder.Services.AddScoped<ServicioBusquedaInteligente>();
        builder.Services.AddScoped<ICarritoRepository, CarritoRepository>();
        builder.Services.AddScoped<ICompraRepository, CompraRepository>();
        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();


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
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
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

            if (dbContext.Database.EnsureCreated())
            {
                var seeder = new SeederLibros(dbContext);
                await seeder.Seeder();
            }
        }
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        
        app.UseSwagger();
        app.UseSwaggerUI( C =>
        {
            C.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookflix API v1");
        });

        app.UseCors(policy =>
            policy.WithOrigins("https://bookflix-server.runasp.net","http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod());

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}