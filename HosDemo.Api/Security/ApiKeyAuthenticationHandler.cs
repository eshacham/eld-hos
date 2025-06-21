using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using System.Text.Encodings.Web;

namespace HosDemo.Api.Security;

public class ApiKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly ApiKeyStore _store;

    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        ApiKeyStore store) : base(options, logger, encoder, clock)
    {
        _store = store;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(ApiKeyAuthenticationDefaults.HeaderName, out var key))
            return Task.FromResult(AuthenticateResult.NoResult());

        var vendorId = Request.Headers[ApiKeyAuthenticationDefaults.VendorHeaderName].FirstOrDefault()
                       ?? _store.ResolveVendorByKey(key);

        if (vendorId is null || !_store.IsMatch(vendorId, key))
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));

        // build a ClaimsPrincipal so [Authorize] works
        var claims  = new[] { new Claim(ClaimTypes.Name, vendorId) };
        var identity = new ClaimsIdentity(claims, ApiKeyAuthenticationDefaults.AuthenticationScheme);
        var ticket   = new AuthenticationTicket(new ClaimsPrincipal(identity),
                                                ApiKeyAuthenticationDefaults.AuthenticationScheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
