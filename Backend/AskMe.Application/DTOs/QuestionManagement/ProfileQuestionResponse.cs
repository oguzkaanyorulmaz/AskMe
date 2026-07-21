using System;
using System.Collections.Generic;

namespace AskMe.Application.DTOs.QuestionManagement;

public class ProfileQuestionsResponse : ResponseDTO
{
    public List<ProfileQuestionItem> Items { get; set; } = new();
}

public class ProfileQuestionItem
{
    public Guid Id { get; set; }
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public string AskedBy { get; set; } = "";
    public List<ProfileAnswerItem> Answers { get; set; } = new();
}

public class ProfileAnswerItem
{
    public Guid Id { get; set; }
    public string Content { get; set; } = "";
}
