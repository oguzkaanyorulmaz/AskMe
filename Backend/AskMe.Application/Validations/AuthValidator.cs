using AskMe.Application.DTOs.Authorization;
using FluentValidation;

namespace AskMe.Application.Validations;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username cannot be null.")
            .MinimumLength(3).WithMessage("Username should be at least 3 characters.")
            .MaximumLength(100).WithMessage("Username can be maximum 100 characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password cannot be null.")
            .MinimumLength(5).WithMessage("Password should be at least 5 characters.")
            .MaximumLength(100).WithMessage("Password can be maximum 100 characters.");
    }
}

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username cannot be null.")
            .MinimumLength(3).WithMessage("Username should be at least 3 characters.")
            .MaximumLength(100).WithMessage("Username can be maximum 100 characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password cannot be null.")
            .MinimumLength(5).WithMessage("Password should be at least 5 characters.")
            .MaximumLength(100).WithMessage("Password can be maximum 100 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email cannot be null.")
            .EmailAddress().WithMessage("Please enter a valid email address.");

        RuleFor(x => x.NameSurname)
            .NotEmpty().WithMessage("Name & surname cannot be null.")
            .MinimumLength(5).WithMessage("Name & surname should be at least 5 characters.")
            .MaximumLength(100).WithMessage("Name & surname can be maximum 100 characters.");
    }
}