namespace OJS.Workers.Common.Extensions;

using System.Security.Cryptography;
using System.Text;

public static class ExceptionExtensions
{
    private const string ErrorCodeKey = "errorCode";

    public static string GetAllMessages(this Exception exception)
    {
        var allMessages = new List<string>
        {
            exception.Message,
        };

        var innerException = exception.InnerException;

        while (innerException != null)
        {
            if (!string.IsNullOrWhiteSpace(innerException.Message))
            {
                allMessages.Add(innerException.Message);
            }

            innerException = innerException.InnerException;
        }

        var message = string.Join($"{Environment.NewLine} ---> ", allMessages);

        return message;
    }

    public static Exception AddErrorCode(this Exception exception)
    {
        using var sha1 = SHA1.Create();
        var hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(exception.ToString()));
        var errorCode = string.Concat(hash[..5].Select(b => b.ToString("x")));
        exception.Data[ErrorCodeKey] = errorCode;
        return exception;
    }

    public static string? GetErrorCode(this Exception exception)
        => (string?)exception.Data[ErrorCodeKey];
}