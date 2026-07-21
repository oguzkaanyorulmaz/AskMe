using System;

namespace AskMe.Application.DTOs.Authorization;

public class LoginResponse
{
    public Guid Id { get; set; }
    public string? Username { get; set; }
    public string? AuthToken { get; set; }
}

