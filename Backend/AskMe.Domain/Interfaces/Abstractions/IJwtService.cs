using System.Security.Claims;

namespace AskMe.Domain.Interfaces.Abstractions;

public interface IJwtService
{
    public string GenerateToken(string? username, IEnumerable<Claim>? additionalClaims = null);
}