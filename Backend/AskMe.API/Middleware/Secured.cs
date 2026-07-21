using AskMe.Application.DTOs;
using AskMe.Domain.CacheItems;
using AskMe.Domain.Interfaces.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AskMe.API.Middleware;

public class Secured : TypeFilterAttribute
{
    public Secured() : base(typeof(SecuredImplementation)) { }

    private class SecuredImplementation : IAsyncActionFilter
    {
        private readonly IAuthSessionCacheProvider _authSessionCacheProvider;

        public SecuredImplementation(IAuthSessionCacheProvider authSessionCacheProvider)
        {
            _authSessionCacheProvider = authSessionCacheProvider;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;
            var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            string? token = authHeader.Substring("Bearer ".Length).Trim();
            if (string.IsNullOrEmpty(token))
            {
                throw new AccessViolationException("Bearer token is not provided");
            }

            AuthSession? sessionInfo = _authSessionCacheProvider.GetAuthInfoWithToken(token);
            if (sessionInfo == null || string.IsNullOrEmpty(sessionInfo.UserName))
            {
                throw new AccessViolationException("Invalid authorization token");
            }

            httpContext.Items["token"] = token;
            httpContext.Items["username"] = sessionInfo.UserName;
            httpContext.Items["role"] = sessionInfo.Role;

            foreach (var arg in context.ActionArguments.Values)
            {
                if (arg is RequestDTO dto)
                {
                    dto.RequestContext = new RequestContext
                    {
                        Token = token,
                        UserName = sessionInfo.UserName,
                        Role = sessionInfo.Role
                    };
                }
            }
            
            await next();
        }
    }
}