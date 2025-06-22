using HosDemo.Api.Services;
using HosDemo.Api.Transport;
using Microsoft.AspNetCore.Mvc;

namespace HosDemo.Api.Controllers;

[ApiController]
[Route("eld/events")]
public class EldController : ControllerBase
{
    private readonly IEldNormalizer _norm;
    private readonly IHosRepository _repo;
    public EldController(IEldNormalizer norm, IHosRepository repo)
    { _norm = norm; _repo = repo; }

    [HttpPost]
    public async Task<IActionResult> Post(EldEventBatch batch)
    {
        // Validate session
        var sessionVendor = GetSessionVendor();
        if (sessionVendor == null)
            return Unauthorized("No valid session");

        // Set vendor from session
        batch.VendorId = sessionVendor;
        
        var snaps = _norm.Normalize(batch);
        await _repo.SaveAsync(snaps);
        return Accepted();
    }

    private string? GetSessionVendor()
    {
        var sessionToken = Request.Headers["Authorization"]
            .FirstOrDefault()?.Replace("Bearer ", "");
            
        return sessionToken != null ? SessionStore.GetVendor(sessionToken) : null;
    }
}
