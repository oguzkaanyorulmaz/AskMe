using AskMe.API.Middleware;
using AskMe.Application.DTOs.QuestionManagement;
using AskMe.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AskMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IQuestionAppService _questionAppService;

    public QuestionController(IQuestionAppService questionAppService)
    {
        _questionAppService = questionAppService;
    }

    [HttpPost("Ask")]
    [Secured]
    public async Task<AskQuestionResponse> AskQuestion([FromBody] AskQuestionRequest request)
    {
        return await _questionAppService.AskQuestion(request);
    }

    [HttpDelete("Delete")]
    [Secured]
    public async Task<DeleteQuestionResponse> DeleteQuestion([FromBody] DeleteQuestionRequest request)
    {
        return await _questionAppService.DeleteQuestion(request);
    }

    [HttpGet("Inbox")]
    [Secured]
    public async Task<GetInboxResponse> GetInbox([FromQuery] GetInboxRequest request)
    {
        return await _questionAppService.GetInbox(request);
    }

    [HttpGet("ProfileQuestions")]
    [Secured]
    public async Task<ProfileQuestionsResponse> GetProfileQuestions([FromQuery] ProfileQuestionsRequest request)
    {
        return await _questionAppService.GetProfileQuestions(request);
    }

}