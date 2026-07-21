using AskMe.Application.DTOs;

namespace AskMe.Application.DTOs.QuestionManagement;

public class ProfileQuestionsRequest : RequestDTO
{
    public required string TargetUsername { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
