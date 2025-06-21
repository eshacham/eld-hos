// Services/SmartNormalizer.cs  (very thin demo)
using HosDemo.Api.Domain;
using HosDemo.Api.Transport;

namespace HosDemo.Api.Services;

public class SmartNormalizer : IEldNormalizer
{
    public IEnumerable<DriverHosSnapshot> Normalize(EldEventBatch batch)
    {
        return batch.Events.Select(e => new DriverHosSnapshot
        {
            DriverId             = e.DriverId,
            VendorId             = batch.VendorId,
            AvailableHours       = e.AvailableHours,
            AvailableDrivingTime = e.AvailableDrivingTime,
            AvailableOnDutyTime  = e.AvailableOnDutyTime,
            Available6070        = e.Available6070,
            DutyStatus           = e.DutyStatus,
            RecordedAt           = e.RecordedAt
        });
    }
}
