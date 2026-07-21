namespace AskMe.Application.DTOs.ProfileManagement;

public class GetProfileRequest : RequestDTO
{
    public required string TargetUsername { get; set; } 
}