using HosDemo.Api.Data;
using HosDemo.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace HosDemo.Api.Services;

public class SqlDriverRepository : IHosRepository
{
    private readonly HosDbContext _db;
    public SqlDriverRepository(HosDbContext db) => _db = db;

    public async Task<DriverHosSnapshot?> GetLatestAsync(Guid driverId) =>
        await _db.DriverHosSnapshots
                 .Where(x => x.DriverId == driverId)
                 .OrderByDescending(x => x.RecordedAt)
                 .FirstOrDefaultAsync();

    public async Task SaveAsync(IEnumerable<DriverHosSnapshot> snapshots)
    {
        _db.DriverHosSnapshots.AddRange(snapshots);
        await _db.SaveChangesAsync();
    }
}
