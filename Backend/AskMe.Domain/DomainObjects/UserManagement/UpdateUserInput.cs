using AskMe.Domain.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.UserManagement
{
    public class UpdateUserInput
    {
        public required string Username { get; set; }
        public string? Email { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Password { get; set; }
        public AccountStatusEnum Status { get; set; }
        public UserRoleEnum? Role { get; set; }
    }
}