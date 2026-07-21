using System;

namespace AskMe.Application.DTOs.QuestionManagement;

public class DeleteQuestionRequest : RequestDTO
{
    public required Guid QuestionId { get; set; } 
}