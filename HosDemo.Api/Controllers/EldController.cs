using HosDemo.Api.Security;
using HosDemo.Api.Services;
using HosDemo.Api.Transport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("eld/events")]
[Authorize(AuthenticationSchemes = ApiKeyAuthenticationDefaults.AuthenticationScheme)]

public class EldController : ControllerBase
{
    private readonly IEldNormalizer _norm;
    private readonly IHosRepository _repo;
    public EldController(IEldNormalizer norm, IHosRepository repo)
    { _norm = norm; _repo = repo; }

    [HttpPost]
    public async Task<IActionResult> Post(EldEventBatch batch)
    {
        var snaps = _norm.Normalize(batch);
        await _repo.SaveAsync(snaps);
        return Accepted();
    }
}
