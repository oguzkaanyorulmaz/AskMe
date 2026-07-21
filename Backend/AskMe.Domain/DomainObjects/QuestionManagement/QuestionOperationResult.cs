using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.DomainObjects.QuestionManagement
{
    public class QuestionOperationResult
    {
        public bool Success { get; set; } = true;
        public string ErrorMessage { get; set; } = string.Empty;
        public Guid? RecordId { get; set; }
    }
}