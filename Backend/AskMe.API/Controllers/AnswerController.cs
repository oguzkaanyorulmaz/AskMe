using AskMe.API.Middleware;
using AskMe.Application.DTOs.AnswerManagement;
using AskMe.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AskMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnswerController : ControllerBase
{
    private readonly IAnswerAppService _answerAppService;

    public AnswerController(IAnswerAppService answerAppService)
    {
        _answerAppService = answerAppService;
    }

    [HttpPost("Answer")]
    [Secured]
    public async Task<AnswerQuestionResponse> AnswerQuestion([FromBody] AnswerQuestionRequest request)
    {
        return await _answerAppService.AnswerQuestion(request);
    }
}