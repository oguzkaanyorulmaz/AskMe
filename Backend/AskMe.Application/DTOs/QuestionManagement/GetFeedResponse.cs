using AskMe.Application.DTOs;
using System;
using System.Collections.Generic;

namespace AskMe.Application.DTOs.QuestionManagement
{
    public class GetFeedResponse : ResponseDTO
    {
        public List<FeedItemDto> Items { get; set; } = new();
    }

    public class FeedItemDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public string AskedBy { get; set; } = "";
        public string AskedTo { get; set; } = "";
        public bool IsAnonymous { get; set; }
        public string Status { get; set; } = "";
        public string FeedType { get; set; } = ""; // "AskedToMe", "AskedByMe", "FollowedUserAnswered", "FollowedUserAsked"
        public List<FeedAnswerItemDto> Answers { get; set; } = new();
    }

    public class FeedAnswerItemDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public string AnsweredByUsername { get; set; } = "";
    }
}
