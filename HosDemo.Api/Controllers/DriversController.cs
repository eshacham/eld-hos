// Controllers/DriversController.cs
using HosDemo.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("drivers")]
public class DriversController : ControllerBase
{
    private readonly IDriverRepository _repo;
    public DriversController(IDriverRepository repo) => _repo = repo;

    [HttpGet("{id:guid}/hos")]
    public async Task<IActionResult> GetHos(Guid id)
    {
        var snap = await _repo.GetLatestAsync(id);
        return snap is null ? NotFound() : Ok(snap);
    }
}
