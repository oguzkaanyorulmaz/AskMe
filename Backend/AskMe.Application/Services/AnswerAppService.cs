using AskMe.Application.DTOs.AnswerManagement;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.QuestionManagement;
using AskMe.Domain.Interfaces.Repositories;
using System.Threading.Tasks;
using AskMe.Application.Extensions;
using System;

namespace AskMe.Application.Services;

public class AnswerAppService : IAnswerAppService
{
    private readonly IQuestionManagementDomainService _questionManagementDomainService;
    private readonly IQuestionRepository _questionRepository;
    private readonly IFollowDomainService _followDomainService;

    public AnswerAppService(
        IQuestionManagementDomainService questionManagementDomainService,
        IQuestionRepository questionRepository,
        IFollowDomainService followDomainService)
    {
        _questionManagementDomainService = questionManagementDomainService;
        _questionRepository = questionRepository;
        _followDomainService = followDomainService;
    }

    public async Task<AnswerQuestionResponse> AnswerQuestion(AnswerQuestionRequest request)
    {
        var question = await _questionRepository.GetById(request.QuestionId);
        if (question == null) throw new Exception("Soru bulunamadı.");

        string currentUsername = request.RequestContext.GetUsername();
        bool isOwnQuestion = string.Equals(question.AskedToUsername, question.AskedByUsername, StringComparison.OrdinalIgnoreCase);

        if (!isOwnQuestion)
        {
            // Sadece sorulan kişi cevaplayabilir
            if (question.AskedToUserId != request.RequestContext.UserId)
            {
                throw new Exception("Bu soruyu cevaplamaya yetkiniz yok.");
            }
        }
        else
        {
            // Kendi kendine sorulan (herkese açık) soru
            if (question.AskedToUserId != request.RequestContext.UserId) // Cevaplayan soru sahibi değilse
            {
                if (question.AllowedAnswerers == "Followers")
                {
                    // Sadece takipçiler cevaplayabilir
                    bool isFollowing = await _followDomainService.IsFollowing(currentUsername, question.AskedToUsername);
                    if (!isFollowing)
                    {
                        throw new Exception("Bu soruyu sadece soru sahibini takip edenler cevaplayabilir.");
                    }
                }
            }
        }

        var input = new AnswerQuestionInput
        {
            QuestionId = request.QuestionId, 
            Content = request.AnswerText, 
            UserId = request.RequestContext.UserId,
            AnswerText = request.AnswerText,
            AnsweredByUsername = currentUsername
        };

        var result = await _questionManagementDomainService.AnswerQuestion(input);

        return new AnswerQuestionResponse { IsSuccess = result.Success };
    }
}