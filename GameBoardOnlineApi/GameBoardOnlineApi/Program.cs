using System.Text;
using Common.Context;
using Common.Exceptions;
using Common.Services;
using GameBoardOnlineApi.GraphQl;
using GameBoardOnlineApi.GraphQl.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Path = System.IO.Path;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(option =>
{
    option.AddDefaultPolicy(corsPolicyBuilder => corsPolicyBuilder
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});

builder.Services.AddControllers();

builder.Services
    .AddHttpContextAccessor()
    .AddGraphQLServer()
    .AddInMemorySubscriptions()
    .AddAuthorization()
    .RegisterDbContext<DataContext>(DbContextKind.Pooled)
    .AddErrorFilter<ErrorFilter>()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddType<UserType>()
    .AddType<RoomType>()
    .AddType<GameType>()
    .AddType<EntityType>()
    .AddType<GamePlayedType>()
    .AddTypeExtension<EntityPlayedType>()
    .AddSocketSessionInterceptor<GraphQLSessionInterceptor>()
    .AddProjections()
    .AddSorting()
    .InitializeOnStartup();

builder.Services.AddPooledDbContextFactory<DataContext>(option =>
{
    option
        .UseNpgsql(
            builder.Configuration.GetConnectionString("Default"), optionsSql =>
            {
                optionsSql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            }
        )
        .UseLazyLoadingProxies()
        .EnableSensitiveDataLogging();
});

builder.Services.AddScoped(sp => sp.GetRequiredService<IDbContextFactory<DataContext>>().CreateDbContext());

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer("websocket", _ => { })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new GameBoardOnlineException("JWT Key missing")))
        };
        
        // https://gist.github.com/PascalSenn/43fedfbc1bc96692d99263a9da2d9ac4
        options.ForwardDefaultSelector = context =>
        {
            if (!context.Request.Headers.TryGetValue("Authorization", out _) &&
                context.Request.Headers.TryGetValue("Upgrade", out var value) &&
                value.Count > 0 &&
                value[0] is "websocket")
            {
                return "websocket";
            }
            return JwtBearerDefaults.AuthenticationScheme;
        };
    })
    ;

builder.Services.AddAuthorization();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<GameService>();
builder.Services.AddScoped<SecurityService>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

var app = builder.Build();

app.UseForwardedHeaders();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "game-board-collections")),
    RequestPath = "/game-board-collections"
});

app.UseCors();

app.UseWebSockets();

app.MapControllers();
app.MapGraphQL();
app.MapGraphQLAltair("/altair");

app.Services.CreateScope().ServiceProvider.GetRequiredService<IDbContextFactory<DataContext>>().CreateDbContext().Database.Migrate();

Console.WriteLine("Started !");

app.Run();