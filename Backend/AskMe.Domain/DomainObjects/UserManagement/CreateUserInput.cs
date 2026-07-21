using AskMe.Domain.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.UserManagement
{
    public class CreateUserInput
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public required string Password { get; set; }
        public required AccountStatusEnum Status { get; set; }
        public required UserRoleEnum? Role { get; set; }
    }
}