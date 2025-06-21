using HosDemo.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace HosDemo.Api.Data;

public class HosDbContext : DbContext
{
    public HosDbContext(DbContextOptions<HosDbContext> options) : base(options) { }

    public DbSet<DriverHosSnapshot> DriverHosSnapshots => Set<DriverHosSnapshot>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<DriverHosSnapshot>()
            .HasKey(x => new { x.DriverId, x.RecordedAt });

        b.Entity<DriverHosSnapshot>()
            .Property(x => x.DutyStatus).HasMaxLength(32);

        b.Entity<DriverHosSnapshot>()
            .Property(x => x.VendorId).HasMaxLength(64);
    }
}
