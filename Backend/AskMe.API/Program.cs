using AskMe.API.Middleware;
using AskMe.Application.DTOs.Authorization;
using AskMe.Application.Interfaces;
using AskMe.Application.Mappings;
using AskMe.Application.Services;
using AskMe.Domain.Interfaces.Abstractions;
using AskMe.Domain.Interfaces.DomainServices;
using AskMe.Domain.Interfaces.Repositories;
using AskMe.Domain.Services;
using AskMe.Infrastructure;
using AskMe.Infrastructure.Cache.Providers;
using AskMe.Infrastructure.Persistence.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using AskMe.Infrastructure.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

#region Dependencies
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddValidatorsFromAssemblyContaining<IAuthorizationAppService>();


InfrastructureAssembly.InjectJWT(ref builder);
InfrastructureAssembly.InjectDatabase(ref builder);
InfrastructureAssembly.InjectCache(ref builder);
#endregion

#region Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>(); 
builder.Services.AddScoped<IAnswerRepository, AnswerRepository>();
builder.Services.AddScoped<IFollowRepository, FollowRepository>();
#endregion

#region App Services
builder.Services.AddScoped<IAuthorizationAppService, AuthorizationAppService>();
builder.Services.AddScoped<ISystemManagementAppService, SystemManagementAppService>();
builder.Services.AddScoped<IQuestionAppService, QuestionAppService>();
builder.Services.AddScoped<IAnswerAppService, AnswerAppService>();
builder.Services.AddScoped<IProfileAppService, ProfileAppService>();
#endregion

#region Domain Services
builder.Services.AddScoped<IAuthorizationDomainService, AuthorizationDomainService>();
builder.Services.AddScoped<ISystemManagementDomainService, SystemManagementDomainService>();
builder.Services.AddScoped<IUserManagementDomainService, UserManagementDomainService>(); // Profil ve Kullanıcı yönetimi tek serviste birleşti
builder.Services.AddScoped<IQuestionManagementDomainService, QuestionManagementDomainService>(); // Soru ve Cevap yönetimi tek serviste birleşti
builder.Services.AddScoped<IFollowDomainService, FollowDomainService>();
#endregion

#region Infrastructure Services
// Şifreleme ve Token (JWT) gibi araçları IoC Container'a kaydediyoruz
builder.Services.AddScoped<ICryptService, CryptService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Eğer ICacheService gibi bir arayüzün/servisin de varsa ve ileride patlamasını istemiyorsan onu da buraya ekleyebilirsin:
// builder.Services.AddScoped<ICacheService, CacheService>();
#endregion


#region Cache Providers
builder.Services.AddScoped<IAuthSessionCacheProvider, AuthSessionCacheProvider>();
builder.Services.AddScoped<ISystemSettingCacheProvider, SystemSettingCacheProvider>();
#endregion

#region Mappings
builder.Services.AddAutoMapper(mappingProfiles =>
{
    mappingProfiles.AddProfile<AuthMappingProfile>();
    mappingProfiles.AddProfile<SystemSettingMappingProfile>();
    mappingProfiles.AddProfile<ProfileMappingProfile>(); 
    mappingProfiles.AddProfile<QuestionAnswerMappingProfile>(); 
});
#endregion

#region Middlewares
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseMiddleware<RunSafely>();
app.UseHttpsRedirection();
app.UseCors("AllowAll"); 
app.UseAuthorization();
app.MapControllers();

app.Run();
#endregion