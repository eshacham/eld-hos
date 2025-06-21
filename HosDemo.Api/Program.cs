using HosDemo.Api.Data;
using HosDemo.Api.Services;
using HosDemo.Api.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;


var builder = WebApplication.CreateBuilder(args);

// ─── Connection string ────────────────────────────────────────────────────────
var conn = builder.Configuration.GetConnectionString("Postgres")
          ?? "Host=localhost;Port=5432;Database=hosdemo;Username=postgres;Password=hosdemo";

// ─── DI  ───────────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<HosDbContext>(o => o.UseNpgsql(conn));

builder.Services.AddScoped<IHosRepository, SqlDriverRepository>();
builder.Services.AddScoped<IEldNormalizer, SmartNormalizer>();

builder.Services.AddControllers();          // generates attribute-routed controllers

// Swagger still works with controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS policy (React dev server)
builder.Services.AddCors(o => o.AddPolicy("Dev", p =>
    p.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
     .AllowAnyHeader()
     .AllowAnyMethod()));

builder.Services.AddSingleton<ApiKeyStore>();  
builder.Services
    .AddAuthentication(ApiKeyAuthenticationDefaults.AuthenticationScheme)
    .AddScheme<AuthenticationSchemeOptions, ApiKeyAuthenticationHandler>(
        ApiKeyAuthenticationDefaults.AuthenticationScheme, _ => { });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("Dev");

// OPTIONAL: auto-apply migrations so tables exist in a fresh DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HosDbContext>();
    db.Database.Migrate();
}

app.UseAuthentication(); // ⬅️ before UseAuthorization
app.UseAuthorization();

// app.UseHttpsRedirection();      // keeps only-HTTPS calls once you enable Kestrel TLS


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// hook up attribute-routed controllers
app.MapControllers();

app.Run();
