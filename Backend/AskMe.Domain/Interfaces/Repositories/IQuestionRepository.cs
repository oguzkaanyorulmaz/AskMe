using AskMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.Repositories
{
    public interface IQuestionRepository
    {
        Task<Guid?> Create(EQuestion question);
        
        Task<bool> DeleteById(Guid id);
        
        Task<EQuestion> GetById(Guid id);
        
        Task<List<EQuestion>> ListByAskedToUsername(string username, int page, int pageSize);

        Task<bool> Update(EQuestion question);
        Task<List<EQuestion>> GetFeedQuestions(string currentUsername, List<string> followedUsernames, int page, int pageSize);
    }
}