using System;

namespace AskMe.Domain.CacheItems
{
    public class UserInfo
    {
        public Guid Id { get; set; } 
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? NameSurname { get; set; }
    }
}