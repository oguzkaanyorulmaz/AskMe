using FluentValidation;

namespace AskMe.Application.DTOs.Authorization;

public class LoginRequest : RequestDTO
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
