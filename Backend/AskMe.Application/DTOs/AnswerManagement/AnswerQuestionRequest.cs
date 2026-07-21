using System;

namespace AskMe.Application.DTOs.AnswerManagement;

public class AnswerQuestionRequest : RequestDTO
{
    public required Guid QuestionId { get; set; } 
    
    public required string AnswerText { get; set; } 
}