using System.Reflection;
using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Games.CodeNames.Events.Requests;
using Common.Games.CodeNames.Models;
using Common.Models;
using Common.Services;
using Microsoft.Extensions.Logging;
using Path = System.IO.Path;

namespace Common.Games.CodeNames;

public class CodeNamesService(ILogger<GameService<CodeNamesGame, CodeNamesPlayer, CodeNamesAction>> logger, DataContext context) : GameService<CodeNamesGame, CodeNamesPlayer, CodeNamesAction>(logger, context)
{
    protected override CodeNamesGame InitializeGameForRoom(Room room, Dictionary<string, object?>? data)
    {
        CheckEnoughPlayers(room, 4);
        
        var teamBeginning = data?.TryGetValue("Team", out var forceTeam) is true ? 
            Enum.Parse<CodeNamesTeam>(forceTeam!.ToString()!) : 
            Random.Shared.Next() > 0.5 ? CodeNamesTeam.Blue : CodeNamesTeam.Red;
        
        CodeNamesGame game = new(teamBeginning);
        game.Words = GetWords(game);

        game.Players = room.Users
            .OrderBy(_ => Random.Shared.Next())
            .Select((u, i) => new CodeNamesPlayer(game, u, i % 2 == 0 ? CodeNamesTeam.Blue : CodeNamesTeam.Red, i < 2))
            .Cast<Player>()
            .ToList();
        
        ChangeCurrentPlayer(game, teamBeginning);
        
        return game;
    }

    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesWordCard> MakeProposal(CodeNamesGame game, User user, CodeNamesMakeProposalEventRequest data)
    {
        CheckStates(game, [CodeNamesState.Proposal, CodeNamesState.LastProposal]);
        
        var player = GetPlayerForUser(game, user);
                
        if (game.CurrentPlayer != null)
        {
            throw new ForbiddenGameActionException("deviner");
        }
                
        if (game.CurrentTeam != player.Team)
        {
            throw new NotCurrentTeamException(game.CurrentTeam.ToString());
        }
        
        if (!player.IsGuesser)
        {
            throw new ForbiddenGameActionException("deviner");
        }

        var card = game.Words.FirstOrDefault(e => e.Word.Trim().ToLower() == data.Word.Trim().ToLower());
        var hint = game.Hints.AsQueryable().FindOrThrow(data.HintId);

        if (((CodeNamesPlayer)hint.Owner!).Team != player.Team)
        {
            throw new ForbiddenGameActionException("deviner car ce n'est pas votre indice");   
        }
                
        if (hint is { IsInfinite: false, Nb: 0 })
        {
            throw new ForbiddenGameActionException("deviner car l'indice ne le permet pas");
        }
                
        if (card == null || card.IsFound)
        {
            throw new NotFoundException<CodeNamesWordCard>(data.Word);
        }

        card.SetFound();

        if (card.Team == player.Team)
        {
            hint.Nb--;

            if (game.GetCurrentState() == CodeNamesState.LastProposal)
            {
                ChangeCurrentPlayer(game);
            }
            if (hint.Nb == 0)
            {
                game.SetState(CodeNamesState.LastProposal);
            }
        }
        else if (card.Team == CodeNamesTeam.Black)
        {
            game.SetState(CodeNamesState.End);
            game.CurrentTeam = null;
            game.CurrentPlayer = null;
        }
        else
        {
            ChangeCurrentPlayer(game);
        }

        var blueWords = game.Words.Where(w => w.Team == CodeNamesTeam.Blue).ToList();
        var redWords = game.Words.Where(w => w.Team == CodeNamesTeam.Red).ToList();
        if (blueWords.Count == blueWords.Count(w => w.IsFound))
        {
            game.SetState(CodeNamesState.End);
            game.CurrentTeam = null;
            game.CurrentPlayer = null;
            game.WinnerTeam = CodeNamesTeam.Blue;
        }
        else if (redWords.Count == redWords.Count(w => w.IsFound))
        {
            game.SetState(CodeNamesState.End);
            game.CurrentTeam = null;
            game.CurrentPlayer = null;
            game.WinnerTeam = CodeNamesTeam.Red;
        }
        
        SaveGame(game);
        
        return new EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesWordCard>
        {
            Game = game,
            Action = CodeNamesAction.Pass,
            Player = player,
            Data = card
        };
    }

    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesHint> GiveHint(CodeNamesGame game, User user, CodeNamesGiveHintEventRequest data)
    {
        CheckState(game, CodeNamesState.Hint);
        
        var player = GetPlayerForUser(game, user);
                
        if (game.CurrentPlayer != player)
        {
            throw new NotCurrentPlayerException(game.CurrentPlayer);
        }
                
        if (game.Hints.Any(h => h.Word.Trim().ToLower() == data.Hint.Trim().ToLower() && h.Team == player.Team))
        {
            throw new ForbiddenGameActionException("Il y a déjà un indice avec ce mot");
        }

        if (game.Words.Any(w => w.Word.Trim().ToLower() == data.Hint.Trim().ToLower()))
        {
            throw new ForbiddenGameActionException("Il y a un mot identique à cet indice");
        }

        var hint = new CodeNamesHint(game, player, data.Hint, data.Nb);
        
        game.CurrentPlayer = null;
        game.Hints.Add(hint);
        game.SetState(CodeNamesState.Proposal);
        
        SaveGame(game);
        
        return new EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesHint>
        {
            Game = game,
            Action = CodeNamesAction.Pass,
            Player = player,
            Data = hint
        };
    }

    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object> Pass(CodeNamesGame game, User user)
    {
        CheckStates(game, [CodeNamesState.Proposal, CodeNamesState.LastProposal]);

        var player = GetPlayerForUser(game, user);
        
        if (game.CurrentTeam != player.Team)
        {
            throw new NotCurrentTeamException(game.CurrentTeam.ToString());
        }

        if (!player.IsGuesser)
        {
            throw new ForbiddenGameActionException("passer");
        }
                
        ChangeCurrentPlayer(game);
        
        SaveGame(game);
        
        return new EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object>
        {
            Game = game,
            Action = CodeNamesAction.Pass,
            Player = player
        };
    }

    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object> Reset(Room room, User user)
    {
        var game = InitializeGame(room);
        
        return new EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object>
        {
            Game = game,
            Action = CodeNamesAction.Reset,
            Player = GetPlayerForUser(game, user)
        };
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

        string[] words;
        
        try
        {
            words = File.ReadAllLines(Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly()!.Location)!,
                "Games/CodeNames/french_words.txt"));
        }
        catch (Exception)
        {
            words = File.ReadAllLines("Games/CodeNames/french_words.txt"); // Case UnitTest
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
                
                return new CodeNamesWordCard(game, word, codeNamesTeam, i % 5, i / 5);
            })
            .OrderBy(_ => Random.Shared.Next())
            .ToList();
    }

    private void ChangeCurrentPlayer(CodeNamesGame game, CodeNamesTeam? forceTeam = null)
    {
        game.CurrentTeam = forceTeam ?? (game.CurrentTeam == CodeNamesTeam.Red ? CodeNamesTeam.Blue : CodeNamesTeam.Red);
        game.CurrentPlayer = game.GetPlayers().First(p => !p.IsGuesser && p.Team == game.CurrentTeam);
        game.SetState(CodeNamesState.Hint);
    }
}