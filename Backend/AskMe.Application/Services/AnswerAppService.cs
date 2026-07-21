using AskMe.Application.DTOs.AnswerManagement;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.QuestionManagement;
using System.Threading.Tasks;
using AskMe.Application.Extensions;

namespace AskMe.Application.Services;

public class AnswerAppService : IAnswerAppService
{
    private readonly IQuestionManagementDomainService _questionManagementDomainService;

    public AnswerAppService(IQuestionManagementDomainService questionManagementDomainService)
    {
        _questionManagementDomainService = questionManagementDomainService;
    }

    public async Task<AnswerQuestionResponse> AnswerQuestion(AnswerQuestionRequest request)
{
    var input = new AnswerQuestionInput
    {
        QuestionId = request.QuestionId, 
        Content = request.AnswerText, 
        UserId = request.RequestContext.UserId,
        AnswerText = request.AnswerText
    };

    var result = await _questionManagementDomainService.AnswerQuestion(input);

    return new AnswerQuestionResponse { IsSuccess = result.Success };
}
}