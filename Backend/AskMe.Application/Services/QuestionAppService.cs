using AskMe.Application.DTOs.QuestionManagement;
using AskMe.Application.Extensions;
using AskMe.Application.Interfaces;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.DomainObjects.QuestionManagement;
using AutoMapper;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AskMe.Application.Services;

public class QuestionAppService : IQuestionAppService
{
    private readonly IQuestionManagementDomainService _questionManagementDomainService;
    private readonly IUserManagementDomainService _userManagementDomainService;
    private readonly IMapper _mapper;
    private readonly IFollowDomainService _followDomainService;

    public QuestionAppService(
        IQuestionManagementDomainService questionManagementDomainService, 
        IUserManagementDomainService userManagementDomainService,
        IMapper mapper,
        IFollowDomainService followDomainService)
    {
        _questionManagementDomainService = questionManagementDomainService;
        _userManagementDomainService = userManagementDomainService;
        _mapper = mapper;
        _followDomainService = followDomainService;
    }

    public async Task<AskQuestionResponse> AskQuestion(AskQuestionRequest request)
    {
        var targetUser = await _userManagementDomainService.GetProfileByUsername(request.AskedToUsername);
        if (targetUser == null) throw new Exception("Target user not found");

        var input = new AskQuestionInput 
        {
            Content = request.QuestionText,
            AskedToUserId = targetUser.Id,
            AskedByUserId = request.RequestContext.UserId,
            IsAnonymous = request.IsAnonymous,
            AskedByUsername = request.RequestContext.GetUsername(),
            AskedToUsername = request.AskedToUsername,
            AllowedAnswerers = request.AllowedAnswerers ?? "Everyone"
        };

        var result = await _questionManagementDomainService.AskQuestion(input);
        return new AskQuestionResponse { IsSuccess = result.Success };
    }

    public async Task<DeleteQuestionResponse> DeleteQuestion(DeleteQuestionRequest request)
    {
        bool success = await _questionManagementDomainService.DeleteQuestion(
            request.QuestionId, 
            request.RequestContext.UserId 
        );
        return new DeleteQuestionResponse { IsSuccess = success };
    }

    public async Task<GetInboxResponse> GetInbox(GetInboxRequest request)
    {
        string currentUsername = request.RequestContext.GetUsername();

        var questions = await _questionManagementDomainService.GetUnansweredQuestions(
            currentUsername, 
            request.Page, 
            request.PageSize
        );

        var safeItems = questions.Select(q => new InboxItem
        {
            Id = q.Id,
            Content = q.Content,
            CreatedAt = q.CreatedAt,
            AskedBy = q.IsAnonymous ? "Gizli Kullanıcı" : q.AskedByUsername 
        }).ToList();

        return new GetInboxResponse { Items = safeItems, IsSuccess = true };
    }

    public async Task<ProfileQuestionsResponse> GetProfileQuestions(ProfileQuestionsRequest request)
    {
        var questions = await _questionManagementDomainService.GetUnansweredQuestions(
            request.TargetUsername, 
            request.Page, 
            request.PageSize
            
        );

        var items = new List<ProfileQuestionItem>();
        foreach (var q in questions)
        {
            var answers = await _questionManagementDomainService.GetAnswersByQuestionId(q.Id);
            items.Add(new ProfileQuestionItem
            {
                Id = q.Id,
                Content = q.Content,
                CreatedAt = q.CreatedAt,
                AskedBy = q.IsAnonymous ? "Gizli Kullanıcı" : q.AskedByUsername ?? "Bilinmeyen",
                AllowedAnswerers = q.AllowedAnswerers ?? "Everyone",
                Answers = answers.Select(a => new ProfileAnswerItem
                {
                    Id = a.Id,
                    Content = a.Content,
                    AnsweredByUsername = a.AnsweredByUsername ?? ""
                }).ToList()
            });
        }

        return new ProfileQuestionsResponse { Items = items, IsSuccess = true };
    }

    public async Task<GetFeedResponse> GetFeed(GetFeedRequest request)
    {
        string currentUsername = request.RequestContext.GetUsername();
        var followedUsernames = await _followDomainService.GetFollowedUsernames(currentUsername);

        var questions = await _questionManagementDomainService.GetFeedQuestions(
            currentUsername,
            followedUsernames,
            request.Page,
            request.PageSize
        );

        var items = new List<FeedItemDto>();
        foreach (var q in questions)
        {
            var answers = await _questionManagementDomainService.GetAnswersByQuestionId(q.Id);
            
            string feedType = "FollowedUserAsked";
            if (string.Equals(q.AskedToUsername, currentUsername, StringComparison.OrdinalIgnoreCase))
            {
                feedType = "AskedToMe";
            }
            else if (string.Equals(q.AskedByUsername, currentUsername, StringComparison.OrdinalIgnoreCase))
            {
                feedType = "AskedByMe";
            }
            else if (followedUsernames.Any(u => string.Equals(u, q.AskedToUsername, StringComparison.OrdinalIgnoreCase)))
            {
                feedType = q.Status == AskMe.Domain.Common.Enums.QuestionStatusEnum.Answered 
                    ? "FollowedUserAnswered" 
                    : "FollowedUserAsked";
            }

            items.Add(new FeedItemDto
            {
                Id = q.Id,
                Content = q.Content,
                CreatedAt = q.CreatedAt,
                AskedBy = q.IsAnonymous ? "Gizli Kullanıcı" : q.AskedByUsername ?? "Bilinmeyen",
                AskedTo = q.AskedToUsername,
                IsAnonymous = q.IsAnonymous,
                Status = q.Status.ToString(),
                FeedType = feedType,
                Answers = answers.Select(a => new FeedAnswerItemDto
                {
                    Id = a.Id,
                    Content = a.Content,
                    CreatedAt = a.CreatedDate,
                    AnsweredByUsername = a.AnsweredByUsername ?? ""
                }).ToList()

            });
        }

        return new GetFeedResponse { Items = items, IsSuccess = true };
    }
}
