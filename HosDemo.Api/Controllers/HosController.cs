using HosDemo.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("drivers")]
public class HosController : ControllerBase
{
    private readonly IHosRepository _repo;
    public HosController(IHosRepository repo) => _repo = repo;

    [HttpGet("{id:guid}/hos")]
    public async Task<IActionResult> GetHos(Guid id)
    {
        var snap = await _repo.GetLatestAsync(id);
        return snap is null ? NotFound() : Ok(snap);
    }
}
