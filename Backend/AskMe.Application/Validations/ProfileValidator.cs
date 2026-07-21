using AskMe.Application.DTOs.ProfileManagement;
using FluentValidation;

namespace AskMe.Application.Validations;

public class GetProfileRequestValidator : AbstractValidator<GetProfileRequest>
{
    public GetProfileRequestValidator()
    {
        RuleFor(x => x.TargetUsername)
            .NotEmpty().WithMessage("Target username cannot be empty.");
    }
}

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    public UpdateProfileRequestValidator()
    {
        RuleFor(x => x.NameSurname)
            .NotEmpty().WithMessage("Name & surname cannot be empty.")
            .MinimumLength(5).WithMessage("Name & surname should be at least 5 characters.")
            .MaximumLength(100).WithMessage("Name & surname can be maximum 100 characters.");

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Bio can be maximum 500 characters."); // Biyografi sınırı
    }
}