using AskMe.Application.DTOs.SystemManagement;
using FluentValidation;

namespace AskMe.Application.Validations;

public class GetSystemSettingsRequestValidator : AbstractValidator<GetSystemSettingsRequest>
{
    public GetSystemSettingsRequestValidator()
    {
        When(x => x.RequestContext != null, () =>
        {
            RuleFor(x => x.RequestContext!.Token)
                .NotEmpty().WithMessage("Authorization token cannot be null.");
            
            // TODO: İleride JWT format kontrolü için System.IdentityModel.Tokens.Jwt
            // kütüphanesini kullanan bir kontrolü doğrudan buraya yazabiliriz.
        });
    }
}
