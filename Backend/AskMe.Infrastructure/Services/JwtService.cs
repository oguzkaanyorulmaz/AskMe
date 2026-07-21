using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace AskMe.Infrastructure.Services;

public class JwtService : IJwtService
{
    private readonly string secretKey;
    private readonly string issuer;
    private readonly string audience;
    private readonly int expiryMinutes;

    public JwtService(IOptions<JwtSettings> jwtOptions)
    {
        var jwtSettings = jwtOptions.Value;

        this.secretKey = jwtSettings.SecretKey;
        this.issuer = jwtSettings.Issuer;
        this.audience = jwtSettings.Audience;
        this.expiryMinutes = jwtSettings.ExpiryMinutes;
    }

    public string GenerateToken(string? username, IEnumerable<Claim>? additionalClaims = null)
    {
        if(string.IsNullOrEmpty(username)) 
        { 
            throw new SecurityTokenArgumentException("Username cannot be null");
        }

        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.secretKey));
        SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (additionalClaims != null)
        {
            claims.AddRange(additionalClaims);
        }

        var token = new JwtSecurityToken(
            issuer: this.issuer,
            audience: this.audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(this.expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}