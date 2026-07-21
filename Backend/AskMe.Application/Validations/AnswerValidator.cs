using AskMe.Application.DTOs.AnswerManagement;
using FluentValidation;
using System;

namespace AskMe.Application.Validations;

public class AnswerQuestionRequestValidator : AbstractValidator<AnswerQuestionRequest>
{
    public AnswerQuestionRequestValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("Question ID cannot be empty.")
            .NotEqual(Guid.Empty).WithMessage("Invalid Question ID.");

        RuleFor(x => x.AnswerText)
            .NotEmpty().WithMessage("Answer text cannot be empty.")
            .MinimumLength(1).WithMessage("Answer text must be at least 1 character.")
            .MaximumLength(1000).WithMessage("Answer can be maximum 1000 characters."); 
    }
}