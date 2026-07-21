using AskMe.Application.DTOs.QuestionManagement;
using AskMe.Application.Extensions;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.QuestionManagement;
using AutoMapper;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace AskMe.Application.Services;

public class QuestionAppService : IQuestionAppService
{
    private readonly IQuestionManagementDomainService _questionManagementDomainService;
    private readonly IUserManagementDomainService _userManagementDomainService;
    private readonly IMapper _mapper;

    public QuestionAppService(
        IQuestionManagementDomainService questionManagementDomainService, 
        IUserManagementDomainService userManagementDomainService,
        IMapper mapper)
    {
        _questionManagementDomainService = questionManagementDomainService;
        _userManagementDomainService = userManagementDomainService;
        _mapper = mapper;
    }

    public async Task<AskQuestionResponse> AskQuestion(AskQuestionRequest request)
    {
        var targetUser = await _userManagementDomainService.GetProfileByUsername(request.AskedToUsername);
        if (targetUser == null) throw new Exception("Target user not found");

        var input = new AskQuestionInput 
        {
            Content = request.QuestionText,
            AskedToUserId = targetUser.Id,
            AskedByUserId = request.RequestContext.UserId,
            IsAnonymous = request.IsAnonymous,
            AskedByUsername = request.RequestContext.GetUsername(),
            AskedToUsername = request.AskedToUsername
        };

        var result = await _questionManagementDomainService.AskQuestion(input);
        return new AskQuestionResponse { IsSuccess = result.Success };
    }

    public async Task<DeleteQuestionResponse> DeleteQuestion(DeleteQuestionRequest request)
    {
        bool success = await _questionManagementDomainService.DeleteQuestion(
            request.QuestionId, 
            request.RequestContext.UserId 
        );
        return new DeleteQuestionResponse { IsSuccess = success };
    }

    public async Task<GetInboxResponse> GetInbox(GetInboxRequest request)
{
    string currentUsername = request.RequestContext.GetUsername();

    var questions = await _questionManagementDomainService.GetUnansweredQuestions(
        currentUsername, 
        request.Page, 
        request.PageSize
    );

    var safeItems = questions.Select(q => new InboxItem
    {
        Id = q.Id,
        Content = q.Content,
        CreatedAt = q.CreatedAt,
        AskedBy = q.IsAnonymous ? "Gizli Kullanıcı" : q.AskedByUsername 
    }).ToList();

    return new GetInboxResponse { Items = safeItems, IsSuccess = true };
}

        public async Task<ProfileQuestionsResponse> GetProfileQuestions(ProfileQuestionsRequest request)
    {
        // 1. Kullanıcıya sorulmuş tüm soruları getir (tarihe göre en yeni en üstte olacak şekilde gelir)
        var questions = await _questionManagementDomainService.GetUnansweredQuestions(
            request.TargetUsername, 
            request.Page, 
            request.PageSize
        );

        var items = new List<ProfileQuestionItem>();
        foreach (var q in questions)
        {
            // 2. Bu soruya verilmiş tüm cevapları getir
            var answers = await _questionManagementDomainService.GetAnswersByQuestionId(q.Id);
            items.Add(new ProfileQuestionItem
            {
                Id = q.Id,
                Content = q.Content,
                CreatedAt = q.CreatedAt,
                AskedBy = q.IsAnonymous ? "Gizli Kullanıcı" : q.AskedByUsername ?? "Bilinmeyen",
                Answers = answers.Select(a => new ProfileAnswerItem
                {
                    Id = a.Id,
                    Content = a.Content
                }).ToList()
            });
        }

        return new ProfileQuestionsResponse { Items = items, IsSuccess = true };
    }


}