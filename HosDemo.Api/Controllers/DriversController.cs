using HosDemo.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HosDemo.Api.Controllers;

[ApiController]
[Route("drivers")]
public class DriversController : ControllerBase
{
    private readonly IHosRepository _repo;
    public DriversController(IHosRepository repo) => _repo = repo;

    [HttpGet("{id:guid}/hos")]
    public async Task<IActionResult> GetHos(Guid id)
    {
        // Validate session
        var sessionVendor = GetSessionVendor();
        if (sessionVendor == null)
            return Unauthorized("No valid session");

        var snap = await _repo.GetLatestAsync(id);
        return snap is null ? NotFound() : Ok(snap);
    }

    private string? GetSessionVendor()
    {
        var sessionToken = Request.Headers["Authorization"]
            .FirstOrDefault()?.Replace("Bearer ", "");
            
        return sessionToken != null ? SessionStore.GetVendor(sessionToken) : null;
    }
}
