namespace AskMe.Application.DTOs.ProfileManagement;

public class UpdateProfileRequest : RequestDTO
{
    public required string NameSurname { get; set; }
    
    public string? Bio { get; set; } 
}