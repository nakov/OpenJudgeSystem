namespace OJS.Servers.Infrastructure.Policy;

using Microsoft.AspNetCore.Authorization;

public class ApiKeyRequirement(string headerName) : IAuthorizationRequirement
{
    public string HeaderName { get; } = headerName;
}