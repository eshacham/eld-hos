// Services/IDriverRepository.cs
using HosDemo.Api.Domain;

namespace HosDemo.Api.Services;

public interface IDriverRepository
{
    Task<DriverHosSnapshot?> GetLatestAsync(Guid driverId);
    Task SaveAsync(IEnumerable<DriverHosSnapshot> snapshots);
}
