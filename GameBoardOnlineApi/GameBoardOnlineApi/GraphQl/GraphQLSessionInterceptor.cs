using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Subscriptions;
using HotChocolate.AspNetCore.Subscriptions.Protocols;
using Microsoft.AspNetCore.Authentication;

namespace GameBoardOnlineApi.GraphQl;

public class GraphQLSessionInterceptor : DefaultSocketSessionInterceptor
{
    private readonly IAuthenticationSchemeProvider _schemes;

    public GraphQLSessionInterceptor(IAuthenticationSchemeProvider schemes)
    {
        _schemes = schemes;
    }

    public override async ValueTask<ConnectionStatus> OnConnectAsync(
        ISocketSession session,
        IOperationMessagePayload connectionInitMessage,
        CancellationToken cancellationToken = default)
    {
        var initialMessageToken = connectionInitMessage.As<InitialMessageToken>();

        if (!string.IsNullOrWhiteSpace(initialMessageToken?.Token))
        {
            var context = session.Connection.HttpContext;

            context.Request.Headers["Authorization"] = $"Bearer {initialMessageToken.Token}";
            context.Features.Set<IAuthenticationFeature>(new AuthenticationFeature
            {
                OriginalPath = context.Request.Path,
                OriginalPathBase = context.Request.PathBase
            });
            // Give any IAuthenticationRequestHandler schemes a chance to handle the request
            var handlers = context.RequestServices.GetRequiredService<IAuthenticationHandlerProvider>();
            foreach (var scheme in await _schemes.GetRequestHandlerSchemesAsync())
            {
                if (handlers.GetHandlerAsync(context, scheme.Name) is IAuthenticationRequestHandler handler && await handler.HandleRequestAsync())
                {
                    return ConnectionStatus.Reject();
                }
            }

            var defaultAuthenticate = await _schemes.GetDefaultAuthenticateSchemeAsync();
            if (defaultAuthenticate != null)
            {
                var result = await context.AuthenticateAsync(defaultAuthenticate.Name);
                if (result.Principal != null)
                {
                    context.User = result.Principal;
                    return ConnectionStatus.Accept();
                }
            }
        }

        return await base.OnConnectAsync(session, connectionInitMessage, cancellationToken);
    }

    private class InitialMessageToken
    {
        public string? Token { get; set; }
    }
}