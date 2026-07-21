using AskMe.Application.DTOs.QuestionManagement;
using FluentValidation;
using System;

namespace AskMe.Application.Validations;

public class AskQuestionRequestValidator : AbstractValidator<AskQuestionRequest>
{
    public AskQuestionRequestValidator()
    {
        RuleFor(x => x.AskedToUsername)
            .NotEmpty().WithMessage("Target username cannot be empty.")
            .MaximumLength(100).WithMessage("Target username can be maximum 100 characters.");

        RuleFor(x => x.QuestionText)
            .NotEmpty().WithMessage("Question text cannot be empty.")
            .MinimumLength(3).WithMessage("Question should be at least 3 characters.")
            .MaximumLength(500).WithMessage("Question can be maximum 500 characters."); // Ask.fm mantığında makul bir sınır
    }
}

public class DeleteQuestionRequestValidator : AbstractValidator<DeleteQuestionRequest>
{
    public DeleteQuestionRequestValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("Question ID cannot be empty.")
            .NotEqual(Guid.Empty).WithMessage("Invalid Question ID.");
    }
}

public class GetInboxRequestValidator : AbstractValidator<GetInboxRequest>
{
    public GetInboxRequestValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page number must be greater than 0.");

        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than 0.")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100 in a single request."); // Veritabanını yormamak için limit
    }
}