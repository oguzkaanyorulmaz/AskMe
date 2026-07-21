using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.QuestionManagement
{
    public class AnswerQuestionInput
    {
        public required Guid QuestionId { get; set; }
        
        public required string Content { get; set; }
        
        public required Guid UserId { get; set; }
        public required string AnswerText { get; set; }
        public Guid AnsweredByUserId { get; set; }
    }
}