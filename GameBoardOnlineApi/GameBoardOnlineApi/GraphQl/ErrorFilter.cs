using Common.Extensions;

namespace GameBoardOnlineApi.GraphQl;

public class ErrorFilter(ILoggerFactory loggerFactory) : IErrorFilter
{
    public IError OnError(IError error)
    {
        if (error.Exception is OperationCanceledException)
        {
            return error;
        }

        var logger = loggerFactory.CreateLogger(error.Exception?.Source ?? "CapdouleurException");
        var message = error.Exception != null ? error.Exception.Message : error.Message;
        var err = error.WithMessage(message);
        logger.LogError(error.Exception, "Error in GaphQL Path : {graphQlPath}\n{graphQlLocation}\n{message}", error.Path, error.Locations?.Select(l => $"Line {l.Line}:{l.Column}").JoinString(" > "), message);
        return err;
    }
}