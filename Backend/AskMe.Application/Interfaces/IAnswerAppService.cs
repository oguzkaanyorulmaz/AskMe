using AskMe.Application.DTOs.AnswerManagement;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface IAnswerAppService
{
    Task<AnswerQuestionResponse> AnswerQuestion(AnswerQuestionRequest request);
}