// Services/IEldNormalizer.cs
using HosDemo.Api.Transport;
using HosDemo.Api.Domain;

namespace HosDemo.Api.Services;

public interface IEldNormalizer
{
    IEnumerable<DriverHosSnapshot> Normalize(EldEventBatch batch);
}
