using HosDemo.Api.Security;
using HosDemo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("drivers")]
[Authorize(AuthenticationSchemes = ApiKeyAuthenticationDefaults.AuthenticationScheme)]
public class DriversController : ControllerBase
{
    private readonly IHosRepository _repo;
    public DriversController(IHosRepository repo) => _repo = repo;

    [HttpGet("{id:guid}/hos")]
    public async Task<IActionResult> GetHos(Guid id)
    {
        var snap = await _repo.GetLatestAsync(id);
        return snap is null ? NotFound() : Ok(snap);
    }
}
