using AskMe.Domain.DomainObjects.QuestionManagement;
using AskMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AskMe.Domain.Interfaces.DomainServices
{
    public interface IQuestionManagementDomainService
    {
        Task<QuestionOperationResult> AskQuestion(AskQuestionInput input);
        Task<QuestionOperationResult> AnswerQuestion(AnswerQuestionInput input);
        
        Task<bool> DeleteQuestion(Guid questionId, Guid requestUserId);
        Task<bool> ReportQuestion(Guid questionId, Guid requestUserId);
        Task<bool> DeleteAnswer(Guid answerId, Guid requestUserId);

        Task<List<EQuestion>> GetUnansweredQuestions(string username, int page, int pageSize);
        Task<List<EQuestion>> GetAnsweredQuestions(Guid userId); 
        Task<List<EQuestion>> GetQuestionsAskedByUser(Guid userId);
        Task<List<EAnswer>> GetAnswersByQuestionId(Guid questionId);
        Task<List<EQuestion>> GetFeedQuestions(string currentUsername, List<string> followedUsernames, int page, int pageSize);


    }
}