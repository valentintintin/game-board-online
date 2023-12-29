using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Common.Context;
using Common.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Common.Services;

public class UserService(ILogger<UserService> logger, IConfiguration configuration, DataContext context) : AService(logger)
{
    public User Create(string name)
    {
        var user = context.Users.FirstOrDefault(u => u.Name.ToLower() == name.Trim().ToLower());

        if (user == null)
        {
            user = new User
            {
                Name = name.Trim(),
            };

            context.Add(user);
            context.SaveChanges();
        }

        return user;
    }

    public string Login(User user)
    {
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