using AskMe.Application.DTOs;

namespace AskMe.Application.DTOs.ProfileManagement
{
    public class FollowRequest : RequestDTO
    {
        public required string TargetUsername { get; set; }
    }
}
