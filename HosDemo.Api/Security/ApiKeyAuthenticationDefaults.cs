namespace HosDemo.Api.Security;

public static class ApiKeyAuthenticationDefaults
{
    public const string AuthenticationScheme = "ApiKey";
    public const string HeaderName            = "X-Api-Key";     // sent by clients
    public const string VendorHeaderName      = "X-Vendor-Id";   // optional — explicit vendor
}
