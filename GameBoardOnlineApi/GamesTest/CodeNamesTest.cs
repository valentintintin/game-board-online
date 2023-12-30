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
            Assert.That(game.Words.Any(w => w is { X: 0, Y: 0 }), Is.True);
            Assert.That(game.Words.Any(w => w is { X: 4, Y: 4 }), Is.True);
            Assert.That(game.Words.Where(w => w.Team == CodeNamesTeam.Black).ToList(), Has.Count.EqualTo(1));
            Assert.That(game.Words.Where(w => w.Team == CodeNamesTeam.Neutral).ToList(), Has.Count.EqualTo(25 - 1 - 8 - 9));
            Assert.That(game.Words.Where(w => w.Team == game.TeamBeginning).ToList(), Has.Count.EqualTo(9));
            Assert.That(game.Words.Where(w => w.Team != CodeNamesTeam.Black && w.Team != CodeNamesTeam.Neutral && w.Team != game.TeamBeginning).ToList(), Has.Count.EqualTo(8));
        });
        
        Assert.Multiple(() =>
        {
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
        var players = game.GetPlayers().ToList();

        // Not current player
        Assert.Throws<NotCurrentPlayerException>(() => service.DoAction(_room, players.First(p => p != game.CurrentPlayer).User, CodeNamesAction.GiveHint, new CodeNamesGiveHintEvent
        {
            Hint = "Test", Nb = 1
        }.ToDictionary()));
        
        // OK
        game = service.DoAction(_room, game.CurrentPlayer!.User, CodeNamesAction.GiveHint, new CodeNamesGiveHintEvent
        {
            Hint = "Test", Nb = 1
        }.ToDictionary());
        
        Assert.Multiple(() =>
        {
            Assert.That(game.Hints, Has.Count.EqualTo(1));
            Assert.That(game.CurrentPlayer, Is.Null);
            Assert.That(game.GetCurrentState(), Is.EqualTo(CodeNamesState.Proposal));
        });
        
        var hint = game.Hints.First();

        // Not current team
        Assert.Throws<NotCurrentTeamException>(() => service.DoAction(_room, players.First(p => p.Team != game.CurrentTeam).User, CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = game.Words.First().Word,
            HintId = hint.Id
        }.ToDictionary()));

        // Correct team but not guesser
        Assert.Throws<ForbiddenGameActionException>(() => service.DoAction(_room, players.First(p => p.Team == game.CurrentTeam && !p.IsGuesser).User, CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = game.Words.First().Word,
            HintId = hint.Id
        }.ToDictionary()));

        var word = game.Words.First(w => w.Team == game.CurrentTeam);
        
        // OK
        game = service.DoAction(_room, players.First(p => p.Team == game.CurrentTeam && p.IsGuesser).User, CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = word.Word,
            HintId = hint.Id
        }.ToDictionary());
        
        Assert.Multiple(() =>
        {
            Assert.That(word.IsFound, Is.True);
            Assert.That(hint.Nb, Is.EqualTo(0));
            Assert.That(game.GetCurrentState(), Is.EqualTo(CodeNamesState.LastProposal));
        });
        
        word = game.Words.First(w => w.Team != game.CurrentTeam && !w.IsFound);

        // Hint alteady used
        Assert.Throws<ForbiddenGameActionException>(() => game = service.DoAction(_room, players.First(p => p.Team == game.CurrentTeam && p.IsGuesser).User, CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = word.Word,
            HintId = hint.Id
        }.ToDictionary()));
        
        // OK
        game = service.DoAction(_room, players.First(p => p.Team == game.CurrentTeam && p.IsGuesser).User, CodeNamesAction.Pass);
        
        Assert.Multiple(() =>
        {
            Assert.That(game.CurrentTeam, Is.Not.EqualTo(game.TeamBeginning));
            Assert.That(game.CurrentPlayer, Is.Not.Null);
            Assert.That(game.GetCurrentState(), Is.EqualTo(CodeNamesState.Hint));
        });
        
        foreach (var words in game.Words.Where(w => w.Team == game.CurrentTeam).Take(7))
        {
            words.SetFound();
        }
        
        Assert.That(game.Words.Where(w => w.Team == game.CurrentTeam && !w.IsFound).ToList(), Has.Count.EqualTo(1));
        
        game = service.DoAction(_room, game.CurrentPlayer!.User, CodeNamesAction.GiveHint, new CodeNamesGiveHintEvent
        {
            Hint = "Test 2", Nb = 1
        }.ToDictionary());
        
        hint = game.Hints.Last();
        word = game.Words.First(w => w.Team == game.CurrentTeam && !w.IsFound);
        
        // OK
        game = service.DoAction(_room, players.First(p => p.Team == game.CurrentTeam && p.IsGuesser).User, CodeNamesAction.MakeProposal, new CodeNamesMakeProposalEvent
        {
            Word = word.Word,
            HintId = hint.Id
        }.ToDictionary());
        
        Assert.Multiple(() =>
        {
            Assert.That(game.Words.Where(w => w.Team == game.CurrentTeam && !w.IsFound).ToList(), Is.Empty);
            Assert.That(game.GetCurrentState(), Is.EqualTo(CodeNamesState.End));
            Assert.That(game.WinnerTeam, Is.EqualTo(word.Team));
        });
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