using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AskMe.Domain.Common.Enums;

namespace AskMe.Domain.Entities
{
    public class EQuestion : EBaseEntity
    {
        public required string Content { get; set; }

        public Guid AskedToUserId { get; set; }

        public Guid? AskedByUserId { get; set; }

        public bool IsAnonymous { get; set; }

        public QuestionStatusEnum Status { get; set; }
        public string? AskedByUsername { get; set; }


        public required string AskedToUsername { get; set; }

        public DateTime CreatedAt { get; set; }
        public string AllowedAnswerers { get; set; } = "Everyone"; // "Everyone" veya "Followers"


        public EQuestion()
        {
            Status = QuestionStatusEnum.Unanswered;
            IsAnonymous = false;
        }
    }
}