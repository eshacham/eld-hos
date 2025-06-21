// Transport/EldEventBatch.cs
namespace HosDemo.Api.Transport;

public class EldEventBatch
{
    public string VendorId { get; set; } = null!;
    public List<UpdateDriverHos> Events { get; set; } = [];
}
