using HosDemo.Api.Data;
using HosDemo.Api.Services;
using Microsoft.EntityFrameworkCore;
using HosDemo.Api.Transport;
using HosDemo.Api.Domain;

var builder = WebApplication.CreateBuilder(args);

// ─── Connection string ────────────────────────────────────────────────────────
var conn = builder.Configuration.GetConnectionString("Postgres")
          ?? "Host=localhost;Port=5432;Database=hosdemo;Username=postgres;Password=hosdemo";

// ─── DI  ───────────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<HosDbContext>(o => o.UseNpgsql(conn));
builder.Services.AddScoped<IDriverRepository, SqlDriverRepository>();
builder.Services.AddScoped<IEldNormalizer, SmartNormalizer>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ─── Endpoints ────────────────────────────────────────────────────────────────
app.MapGet("/drivers/{id:guid}/hos",
    async (Guid id, IDriverRepository repo) =>
        await repo.GetLatestAsync(id) is { } snap
            ? Results.Ok(snap) : Results.NotFound())
   .WithName("GetDriverHos")
   .Produces<DriverHosSnapshot>()
   .Produces(404);

app.MapPost("/eld/events",
    async (EldEventBatch batch, IEldNormalizer normalizer, IDriverRepository repo) =>
    {
        var snapshots = normalizer.Normalize(batch);
        await repo.SaveAsync(snapshots);
        return Results.Accepted();
    })
   .WithName("PostEldEvents")
   .Accepts<EldEventBatch>("application/json");

app.Run();
