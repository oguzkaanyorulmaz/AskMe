using AskMe.Application.DTOs.QuestionManagement;
using System.Threading.Tasks;

namespace AskMe.Application.Interfaces;

public interface IQuestionAppService
{
    Task<AskQuestionResponse> AskQuestion(AskQuestionRequest request);
    Task<DeleteQuestionResponse> DeleteQuestion(DeleteQuestionRequest request);
    Task<GetInboxResponse> GetInbox(GetInboxRequest request);
    Task<ProfileQuestionsResponse> GetProfileQuestions(ProfileQuestionsRequest request);
    Task<GetFeedResponse> GetFeed(GetFeedRequest request);
}
