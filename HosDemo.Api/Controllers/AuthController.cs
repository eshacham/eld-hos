using Microsoft.AspNetCore.Mvc;

namespace HosDemo.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{

    [HttpPost("login")]
    public IActionResult Login([FromBody] VendorLoginRequest request)
    {
        // Validate vendor-specific credentials
        if (!IsValidVendorUser(request.VendorId, request.Username, request.Password))
            return Unauthorized("Invalid credentials for vendor");

        var sessionToken = Guid.NewGuid().ToString();
        SessionStore.SetSession(sessionToken, request.VendorId);

        return Ok(new { SessionToken = sessionToken, VendorId = request.VendorId });
    }

    private static bool IsValidVendorUser(string vendorId, string username, string password)
    {
        // Hardcoded credentials for demo
        return username == "user" && password == "pass";
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        SessionStore.RemoveSession(request.SessionToken);
        return Ok();
    }
}

public record VendorLoginRequest(string VendorId, string Username, string Password);
public record LogoutRequest(string SessionToken);

// Simple in-memory session store (use Redis in production)
public static class SessionStore
{
    private static readonly Dictionary<string, string> _sessions = new();

    public static void SetSession(string token, string vendorId)
    {
        _sessions[token] = vendorId;
    }

    public static string? GetVendor(string token)
    {
        return _sessions.TryGetValue(token, out var vendor) ? vendor : null;
    }

    public static void RemoveSession(string token)
    {
        _sessions.Remove(token);
    }
}