using AskMe.Domain.DomainObjects.QuestionManagement;
using AskMe.Domain.Entities;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AskMe.Domain.Common.Enums;

namespace AskMe.Domain.Services
{
    public class QuestionManagementDomainService : IQuestionManagementDomainService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IAnswerRepository _answerRepository; // EKLENEN SATIR 1

        public QuestionManagementDomainService(IQuestionRepository questionRepository, IAnswerRepository answerRepository)
        {
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
        }

        public async Task<QuestionOperationResult> AskQuestion(AskQuestionInput input)
        {
            var newQuestion = new EQuestion
            {
                Id = Guid.NewGuid(),
                Content = input.Content,
                AskedToUserId = input.AskedToUserId,
                AskedByUserId = input.AskedByUserId,
                IsAnonymous = input.IsAnonymous,
                AskedToUsername = input.AskedToUsername,
                CreatedAt = DateTime.UtcNow,
                AskedByUsername = input.AskedByUsername,
                AllowedAnswerers = input.AllowedAnswerers
            };

            await _questionRepository.Create(newQuestion); 

            return new QuestionOperationResult { Success = true };
        }

        public async Task<QuestionOperationResult> AnswerQuestion(AnswerQuestionInput input)
{
    var newAnswer = new EAnswer
    {
        Id = Guid.NewGuid(),
        QuestionId = input.QuestionId,
        Content = input.AnswerText,
        
        UserId = input.AnsweredByUserId,
        AnsweredByUsername = input.AnsweredByUsername
    };
    
    await _answerRepository.Create(newAnswer);

    var question = await _questionRepository.GetById(input.QuestionId);
    if (question != null)
    {
        question.Status = QuestionStatusEnum.Answered;
        
        await _questionRepository.Update(question); 
    }

    return new QuestionOperationResult { Success = true }; 
}

        public async Task<bool> DeleteQuestion(Guid questionId, Guid requestUserId)
        {
            bool isDeleted = await _questionRepository.DeleteById(questionId);
    
         return isDeleted;
        
        
        }
        public async Task<bool> ReportQuestion(Guid questionId, Guid requestUserId) => true;
        public async Task<bool> DeleteAnswer(Guid answerId, Guid requestUserId) => true;

        public async Task<List<EQuestion>> GetUnansweredQuestions(string username, int page, int pageSize)
        {
        return await _questionRepository.ListByAskedToUsername(username, page, pageSize);
        }

        public async Task<List<EQuestion>> GetAnsweredQuestions(Guid userId) => new();
        public async Task<List<EQuestion>> GetQuestionsAskedByUser(Guid userId) => new();
                public async Task<List<EAnswer>> GetAnswersByQuestionId(Guid questionId)
        {
            return await _answerRepository.GetByQuestionId(questionId);
        }
        public async Task<List<EQuestion>> GetFeedQuestions(string currentUsername, List<string> followedUsernames, int page, int pageSize)
{
    return await _questionRepository.GetFeedQuestions(currentUsername, followedUsernames, page, pageSize);
}


    }
}