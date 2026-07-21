using AskMe.Domain.CacheItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.UserManagement
{
    public class UpdateUserResult
    {
        public bool Success { get; set; } = true;
        public string ErrorMessage { get; set; } = string.Empty;
        public UserInfo? UserInfo { get; set; }
    }
}