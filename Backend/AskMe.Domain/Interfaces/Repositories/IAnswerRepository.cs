using AskMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.Repositories
{
    public interface IAnswerRepository
    {
        Task<Guid?> Create(EAnswer answer);
        Task<bool> DeleteById(Guid answerId);
        Task<EAnswer?> GetById(Guid answerId);
        Task<bool> UpdateAnswer(EAnswer answer);
        
        Task<List<EAnswer>> GetByQuestionId(Guid questionId);
    }
}