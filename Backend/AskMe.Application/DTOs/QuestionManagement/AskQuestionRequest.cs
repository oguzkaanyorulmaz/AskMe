namespace AskMe.Application.DTOs.QuestionManagement;

public class AskQuestionRequest : RequestDTO
{
    public required string AskedToUsername { get; set; }
    public required string QuestionText { get; set; }
    public bool IsAnonymous { get; set; }
}