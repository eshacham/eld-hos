using HosDemo.Api.Domain;
using HosDemo.Api.Transport;

namespace HosDemo.Api.Services;

public class SmartNormalizer : IEldNormalizer
{
    private readonly Dictionary<string, Func<UpdateDriverHos, DriverHosSnapshot>> _maps;

    public SmartNormalizer()
    {
        _maps = new()
        {
            ["KEEPTRUCKIN"] = e => MapKt(e),
            ["SAM_SAT"] = e => MapSamsung(e),
            ["DemoSim"] = e => MapDemo(e)      
        };
    }

    public IEnumerable<DriverHosSnapshot> Normalize(EldEventBatch batch)
    {
        if (!_maps.TryGetValue(batch.VendorId, out var mapper))
            throw new NotSupportedException($"Vendor {batch.VendorId} not configured.");

        return batch.Events.Select(mapper);
    }

    private static DriverHosSnapshot MapKt(UpdateDriverHos e) => new()
    {
        DriverId = e.DriverId,
        VendorId = "KEEPTRUCKIN",
        DutyStatus = e.DutyStatus ?? "ON_DUTY",
        RecordedAt = e.RecordedAt,
        AvailableHours = e.AvailableHours,
        AvailableDrivingTime = e.AvailableDrivingTime,
        AvailableOnDutyTime = e.AvailableOnDutyTime,
        Available6070 = e.Available6070
    };


    private static DriverHosSnapshot MapSamsung(UpdateDriverHos e) => new()
    {
        DriverId = e.DriverId,
        VendorId = "SAM_SAT",
        DutyStatus = e.DutyStatus ?? "ON_DUTY",
        RecordedAt = e.RecordedAt,
        AvailableHours = e.AvailableHours,
        AvailableDrivingTime = e.AvailableDrivingTime,
        AvailableOnDutyTime = e.AvailableOnDutyTime,
        Available6070 = e.Available6070
    };
    private static DriverHosSnapshot MapDemo(UpdateDriverHos e) => new()
    {
        DriverId = e.DriverId,
        VendorId = "DemoSim",
        DutyStatus = e.DutyStatus ?? "ON_DUTY",
        RecordedAt = e.RecordedAt,
        AvailableHours = e.AvailableHours,
        AvailableDrivingTime = e.AvailableDrivingTime,
        AvailableOnDutyTime = e.AvailableOnDutyTime,
        Available6070 = e.Available6070
    };
}
