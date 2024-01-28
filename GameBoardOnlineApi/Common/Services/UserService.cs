using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Common.Services;

public class UserService(ILogger<UserService> logger, IConfiguration configuration, IDbContextFactory<DataContext> dbContextFactory) : AService(logger, dbContextFactory)
{
    public User Create(string name, string color)
    {
        var user = Context.Users.FirstOrDefault(u => u.Name.ToLower() == name.Trim().ToLower());

        if (user == null)
        {
            user = new User
            {
                Name = name.Trim(),
                Color = color
            };

            Context.Add(user);
        }
        else
        {
            user.Color = color;
            Context.Update(user);
        }

        Context.SaveChanges();

        return user;
    }

    public string Login(long userId)
    {
        var user = Context.Users.FindOrThrow(userId);
        
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? throw new GameBoardOnlineException("JWT Key missing"))),
            SecurityAlgorithms.HmacSha256Signature
        );
        
        JwtSecurityToken tokenDescriptor = new(
            signingCredentials: signingCredentials,
            claims: new []
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
            }
        );
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}