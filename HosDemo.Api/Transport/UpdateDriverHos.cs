namespace HosDemo.Api.Transport;

public class UpdateDriverHos
{
    public Guid    DriverId              { get; set; }
    public int?    AvailableHours        { get; set; }
    public decimal? AvailableDrivingTime { get; set; }
    public decimal? AvailableOnDutyTime  { get; set; }
    public decimal? Available6070        { get; set; }
    public string? DutyStatus            { get; set; }
    public DateTimeOffset RecordedAt     { get; set; }
}
