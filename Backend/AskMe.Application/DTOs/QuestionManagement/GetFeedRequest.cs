using AskMe.Application.DTOs;

namespace AskMe.Application.DTOs.QuestionManagement
{
    public class GetFeedRequest : RequestDTO
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 100;
    }
}
