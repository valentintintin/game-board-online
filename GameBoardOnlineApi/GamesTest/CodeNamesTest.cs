using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Games.CodeNames;
using Common.Games.CodeNames.Events;
using Common.Games.CodeNames.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CodeNamesTest;

public class Tests
{
    private Room _room = null!;
    
    [SetUp]
    public void Setup()
    {
        User[] users =
        [
            new User
            {
                Name = "Valentin"
            },
            new User
            {
                Name = "Juline"
            },
            new User
            {
                Name = "Willyam"
            },
            new User
            {
                Name = "Enora"
            }
        ];

        _room = new Room
        {
            Name = "Test",
            Owner = users[0],
            Users = users
        };
    }

    [Test]
    public void InitializeGame()
    {
        var game = GetRequiredService<CodeNamesService>().InitializeGame(_room);
        Assert.Multiple(() =>
        {
            Assert.That(game.Words, Has.Count.EqualTo(25));
            Assert.That(game.Words.Where(w => w.Team == CodeNamesTeam.Black).ToList(), Has.Count.EqualTo(1));
            Assert.That(game.Words.Where(w => w.Team == CodeNamesTeam.Neutral).ToList(), Has.Count.EqualTo(25 - 1 - 8 - 9));
            Assert.That(game.Words.Where(w => w.Team == game.TeamBeginning).ToList(), Has.Count.EqualTo(9));
            Assert.That(game.Words.Where(w => w.Team != CodeNamesTeam.Black && w.Team != CodeNamesTeam.Neutral && w.Team != game.TeamBeginning).ToList(), Has.Count.EqualTo(8));

            var players = game.GetPlayers().ToList();
            
            Assert.That(players.ElementAt(0).IsGuesser, Is.True);
            Assert.That(players.ElementAt(0).Team, Is.EqualTo(CodeNamesTeam.Blue));

            Assert.That(players.ElementAt(1).IsGuesser, Is.True);
            Assert.That(players.ElementAt(1).Team, Is.EqualTo(CodeNamesTeam.Red));
            
            Assert.That(players.ElementAt(2).IsGuesser, Is.False);
            Assert.That(players.ElementAt(2).Team, Is.EqualTo(CodeNamesTeam.Blue));
            
            Assert.That(players.ElementAt(3).IsGuesser, Is.False);
            Assert.That(players.ElementAt(3).Team, Is.EqualTo(CodeNamesTeam.Red));
        });
        
        Assert.Multiple(() =>
        {
            Assert.That(GetRequiredService<DataContext>().Users.ToList(), Has.Count.EqualTo(4));
            Assert.That(GetRequiredService<DataContext>().Rooms.ToList(), Has.Count.EqualTo(1));
            Assert.That(GetRequiredService<DataContext>().Games.ToList(), Has.Count.EqualTo(1));
            Assert.That(GetRequiredService<DataContext>().Players.ToList(), Has.Count.EqualTo(4));
        });
    }

    [Test]
    public void MakeHintAndProposal()
    {
        var service = GetRequiredService<CodeNamesService>();
        var game = service.InitializeGame(_room);

        game = service.DoAction(_room, _room.Users.ElementAt(0), CodeNamesAction.GiveHint, new CodeNamesGiveHintEvent
        {
            Hint = "Test", Nb = 1
        }.ToDictionary());
        Assert.That(game.Hints, Has.Count.EqualTo(1));
    }

    [Test]
    public void MakeProposal()
    {
        var service = GetRequiredService<CodeNamesService>();
        var game = service.InitializeGame(_room);

        game = service.DoAction(_room, _room.Users.ElementAt(2), CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = game.Words.First().Word
        }.ToDictionary());
        Assert.That(game.Words.First().IsFound, Is.True);

        Assert.Throws<NotFoundException<CodeNamesWordCard>>(() => service.DoAction(_room, _room.Users.ElementAt(2), CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = game.Words.First().Word
        }.ToDictionary()));

        Assert.Throws<NotFoundException<CodeNamesWordCard>>(() => service.DoAction(_room, _room.Users.ElementAt(2), CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = "dodsfkdsfdsfidsq"
        }.ToDictionary()));
    }

    private T GetRequiredService<T>() where T : class
    {
        var services = new ServiceCollection();

        services.AddLogging();
        services.AddDbContextFactory<DataContext>(option =>
        {
            option
                .UseInMemoryDatabase("database")
                .UseLazyLoadingProxies();
        });
        services.AddScoped<CodeNamesService>();

        return services.BuildServiceProvider().GetRequiredService<T>();
    }
}