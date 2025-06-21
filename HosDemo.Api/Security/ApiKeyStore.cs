// Security/ApiKeyStore.cs
namespace HosDemo.Api.Security;

public class ApiKeyStore
{
    private readonly Dictionary<string /*vendorId*/, string /*apiKey*/> _map;

    public ApiKeyStore(IConfiguration config)
    {
        _map = config.GetSection("VendorApiKeys")
                     .Get<Dictionary<string,string>>()               // "vendorId": "key"
               ?? [];
    }

    public bool IsMatch(string vendorId, string key) =>
        _map.TryGetValue(vendorId, out var correct) && correct == key;

    public string? ResolveVendorByKey(string key) =>
        _map.FirstOrDefault(kv => kv.Value == key).Key;
}
