using System;
using System.Collections.Generic;

namespace AskMe.Application.DTOs.QuestionManagement;

public class GetInboxResponse : ResponseDTO
{
    public required List<InboxItem> Items { get; set; }
}

public class InboxItem
{
    public Guid Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AskedBy { get; set; } 
}