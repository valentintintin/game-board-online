using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Common.Exceptions;

namespace Common.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static long GetUserId(this ClaimsPrincipal claims)
    {
        try
        {
            return long.Parse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException());
        }
        catch (Exception)
        {
            throw new UnauthorizedException("No user");
        }
    }
    
    public static long? TryGetUserId(this ClaimsPrincipal claims)
    {
        try
        {
            return long.Parse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException());
        }
        catch (Exception)
        {
            return null;
        }
    }
}