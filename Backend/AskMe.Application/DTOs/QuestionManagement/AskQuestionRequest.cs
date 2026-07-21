namespace AskMe.Application.DTOs.QuestionManagement;

public class AskQuestionRequest : RequestDTO
{
    public required string AskedToUsername { get; set; }
    public required string QuestionText { get; set; }
    public bool IsAnonymous { get; set; }
    public string AllowedAnswerers { get; set; } = "Everyone"; // "Everyone" veya "Followers"

}