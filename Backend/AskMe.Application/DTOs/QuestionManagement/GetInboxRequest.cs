namespace AskMe.Application.DTOs.QuestionManagement;

public class GetInboxRequest : RequestDTO
{

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}