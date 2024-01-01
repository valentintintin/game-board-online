using System.Text;
using Common.Context;
using Common.Exceptions;
using Common.Games.CodeNames;
using Common.Services;
using GameBoardOnlineApi.GraphQl;
using GameBoardOnlineApi.GraphQl.Games.CodeNames.Types;
using GameBoardOnlineApi.GraphQl.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
    
builder.Services
    .AddGraphQLServer()
    .AddInMemorySubscriptions()
    .AddAuthorization()
    .RegisterDbContext<DataContext>()
    .AddErrorFilter<ErrorFilter>()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddType<RoomType>()
    .AddType<GameSimpleType>()
    .AddType<CodeNamesWordCardType>()
    .AddProjections();

builder.Services.AddDbContextFactory<DataContext>(option =>
{
    option.UseSqlite(
        builder.Configuration.GetConnectionString("Default")
    )
    .UseLazyLoadingProxies();
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new GameBoardOnlineException("JWT Key missing")))
        };
    });

builder.Services.AddAuthorization();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Authorisation JWT en en-tete en utilisant Bearer. \r\n\r\n Entrer 'Bearer' [esspace] et le token dans le champs.\r\n\r\nExample: \"Bearer 12345abcdef\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<CodeNamesService>();

var app = builder.Build();

app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseWebSockets();

app.MapControllers();
app.MapGraphQL();

app.Services.CreateScope().ServiceProvider.GetRequiredService<DataContext>().Database.Migrate();

Console.WriteLine("Started !");

app.Run();