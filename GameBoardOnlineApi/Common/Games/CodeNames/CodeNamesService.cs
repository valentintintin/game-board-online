using System.Reflection;
using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Games.CodeNames.Events;
using Common.Games.CodeNames.Models;
using Common.Models;
using Common.Services;
using Microsoft.Extensions.Logging;
using FileNotFoundException = System.IO.FileNotFoundException;
using Path = System.IO.Path;

namespace Common.Games.CodeNames;

public class CodeNamesService(ILogger<GameService<CodeNamesGame, CodeNamesPlayer, CodeNamesAction>> logger, DataContext context) : GameService<CodeNamesGame, CodeNamesPlayer, CodeNamesAction>(logger, context)
{
    protected override CodeNamesGame InitializeGameForRoom(Room room)
    {
        CheckEnoughPlayers(room, 4);
        
        var teamBeginning = Random.Shared.Next() > 0.5 ? CodeNamesTeam.Blue : CodeNamesTeam.Red;
        CodeNamesGame game = new(teamBeginning);
        game.Words = GetWords(game);

        game.Players = room.Users
            .OrderBy(_ => Random.Shared.Next())
            .Select((u, i) => new CodeNamesPlayer(game, u, i % 2 == 0 ? CodeNamesTeam.Blue : CodeNamesTeam.Red, i < 2))
            .Cast<Player>()
            .ToList();
        
        return game;
    }

    protected override CodeNamesGame DoActionForGame(Room room, CodeNamesGame game, CodeNamesPlayer player, CodeNamesAction codeNamesAction,
        Dictionary<string, object?>? data)
    {
        switch (codeNamesAction)
        {
            case CodeNamesAction.Reset:
                game = InitializeGame(room);
                break;
            case CodeNamesAction.GiveHint:
                var giveHintEvent = data!.ToObject<CodeNamesGiveHintEvent>();
                game.Hints.Add(new CodeNamesHint(game, player, giveHintEvent.Hint, giveHintEvent.Nb));
                break;
            case CodeNamesAction.MakeProposal:
                var makeProposalEvent = data!.ToObject<CodeNamesMakeProposalEvent>();
                var card = game.Words.FirstOrDefault(e => e.Word.Trim().ToLower() == makeProposalEvent.Word.Trim().ToLower());

                if (card == null || card.IsFound)
                {
                    throw new NotFoundException<CodeNamesWordCard>(makeProposalEvent.Word);
                }

                card.SetFound();
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(codeNamesAction), codeNamesAction, null);
        }
        
        return game;
    }

    private List<CodeNamesWordCard> GetWords(CodeNamesGame game)
    {
        var nbRed = 8;
        var nbBlue = 8;

        if (game.TeamBeginning == CodeNamesTeam.Blue)
        {
            nbBlue++;
        }
        else
        {
            nbRed++;
        }

        string[] words = [];
        
        try
        {
            words = File.ReadAllLines(Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly()!.Location)!,
                "Games/CodeNames/french_words.txt"));
        }
        catch (Exception)
        {
            words = File.ReadAllLines("Games/CodeNames/french_words.txt");
        }

        return words
            .OrderBy(_ => Random.Shared.Next())
            .Take(25)
            .Select((word, i) =>
            {
                CodeNamesTeam codeNamesTeam;
                
                if (nbBlue > 0)
                {
                    codeNamesTeam = CodeNamesTeam.Blue;
                    nbBlue--;
                }
                else if (nbRed > 0)
                {
                    codeNamesTeam = CodeNamesTeam.Red;
                    nbRed--;
                }
                else if (i != 24)
                {
                    codeNamesTeam = CodeNamesTeam.Neutral;
                }
                else
                {
                    codeNamesTeam = CodeNamesTeam.Black;
                }
                
                return new CodeNamesWordCard(game, word, codeNamesTeam);
            })
            .OrderBy(_ => Random.Shared.Next())
            .ToList();
    }
}