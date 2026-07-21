using AskMe.Domain.Common.Enums;
using AskMe.Domain.Interfaces.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Entities
{
    public class EUser : EBaseEntity
    {
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string Email { get; set; }
        public string? NameSurname { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public required UserRoleEnum? Role { get; set; }
        public required AccountStatusEnum Status { get; set; }

        public bool IsPasswordValid(string plainPassword, ICryptService cryptService)
        {
            string hashedInput = cryptService.HashPassword(plainPassword);
            return this.PasswordHash == hashedInput;
        }
    }
}