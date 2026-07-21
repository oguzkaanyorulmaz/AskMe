using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.Authorization
{
    public class LoginResult
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? AuthToken { get; set; }
    }
}