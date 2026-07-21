using System;

namespace AskMe.Application.DTOs.ProfileManagement;

public class GetProfileResponse : ResponseDTO
{
    public Guid UserId { get; set; }
    public string? Username { get; set; }
    public string? NameSurname { get; set; }
    public string? Bio { get; set; }
}