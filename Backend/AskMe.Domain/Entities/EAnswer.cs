using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Entities
{
    public class EAnswer : EBaseEntity
    {
        public required string Content { get; set; }

        public Guid QuestionId { get; set; }

        public Guid UserId { get; set; }

        public EAnswer()
        {
        }
    }
}