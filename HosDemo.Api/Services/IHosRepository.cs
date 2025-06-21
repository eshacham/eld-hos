using HosDemo.Api.Domain;

namespace HosDemo.Api.Services;

public interface IHosRepository
{
    Task<DriverHosSnapshot?> GetLatestAsync(Guid driverId);
    Task SaveAsync(IEnumerable<DriverHosSnapshot> snapshots);
}
