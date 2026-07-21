using AskMe.Application.DTOs;
using System;

namespace AskMe.Application.Extensions;

public static class RequestContextExtensions
{
    public static string GetUsername(this RequestContext? requestContext)
    {
        if (requestContext is null)
            throw new ArgumentNullException(nameof(requestContext), "RequestContext cannot be null.");

        if (string.IsNullOrEmpty(requestContext.UserName))
        {
            throw new ArgumentNullException(nameof(requestContext.UserName), "Username in RequestContext is null or empty.");
        }

        return requestContext.UserName;
    }

    public static string GetToken(this RequestContext? requestContext)
    {
        if (requestContext is null)
            throw new ArgumentNullException(nameof(requestContext), "RequestContext cannot be null.");

        if (string.IsNullOrEmpty(requestContext.Token))
        {
            throw new ArgumentNullException(nameof(requestContext.Token), "Token in RequestContext is null or empty.");
        }

        return requestContext.Token;
    }

    
}