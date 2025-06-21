using HosDemo.Api.Data;
using HosDemo.Api.Services;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

// OPTIONAL: auto-apply migrations so tables exist in a fresh DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HosDbContext>();
    db.Database.Migrate();
}

app.UseCors("Dev");
app.UseHttpsRedirection();      // keeps only-HTTPS calls once you enable Kestrel TLS

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// hook up attribute-routed controllers
app.MapControllers();

app.Run();
