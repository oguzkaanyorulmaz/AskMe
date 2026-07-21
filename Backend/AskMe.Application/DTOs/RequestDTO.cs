using AskMe.Domain.Common.Enums;

namespace AskMe.Application.DTOs
{
    public abstract class RequestDTO
    {
        public RequestContext? RequestContext { get; set; }
    }

    public class RequestContext
    {
        public string? Token { get; set; }
        public string? UserName { get; set; }
        public Guid UserId { get; set; }
        public UserRoleEnum? Role { get; set; }
    }
}