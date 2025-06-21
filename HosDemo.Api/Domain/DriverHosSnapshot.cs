namespace HosDemo.Api.Domain;

public record DriverHosSnapshot
{
    public Guid    DriverId             { get; init; }
    public string  VendorId             { get; init; } = null!;
    public int?    AvailableHours       { get; init; }
    public decimal? AvailableDrivingTime { get; init; }
    public decimal? AvailableOnDutyTime  { get; init; }
    public decimal? Available6070        { get; init; }
    public string? DutyStatus            { get; init; }
    public DateTimeOffset RecordedAt     { get; init; }
}
