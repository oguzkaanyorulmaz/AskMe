using FluentValidation;


namespace AskMe.Application.DTOs.Authorization;

public class RegisterRequest : RequestDTO
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
    public required string NameSurname { get; set; }
}
