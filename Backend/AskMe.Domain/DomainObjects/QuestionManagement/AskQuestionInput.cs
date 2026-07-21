using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.QuestionManagement
{
    public class AskQuestionInput
    {
        public required string Content { get; set; }
        
        public required Guid AskedToUserId { get; set; }
        
        public Guid? AskedByUserId { get; set; }
        
        public bool IsAnonymous { get; set; }

        public string? AskedByUsername { get; set; }


        public required string AskedToUsername { get; set; }
    }
}