using AskMe.Domain.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AskMe.API.Middleware;

public class RoleRequired : TypeFilterAttribute
{
    public RoleRequired(UserRoleEnum[] requiredRoleArray) : base(typeof(RoleRequiredImplementation)) 
    {
        Arguments = new object[] { requiredRoleArray };
    }

    private class RoleRequiredImplementation : IAsyncActionFilter
    {
        private readonly UserRoleEnum[] _requiredRoleArray;

        public RoleRequiredImplementation(UserRoleEnum[] requiredRoleArray)
        {
            _requiredRoleArray = requiredRoleArray;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;
            
            string? username = httpContext.Items["username"] as string;
            if(string.IsNullOrEmpty(username))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            UserRoleEnum userRole = (UserRoleEnum)(httpContext.Items["role"] ?? UserRoleEnum.None);
            if(!_requiredRoleArray.Contains(userRole))
            {
                context.Result = new UnauthorizedResult();
                return;
            }
           
            await next();
        }
    }
}