namespace OJS.Workers.Common.Extensions;

using System.Globalization;
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
        var hash = SHA1.HashData(Encoding.UTF8.GetBytes(exception.ToString()));
        var errorCode = string.Concat(hash[..5].Select(b => b.ToString("x", CultureInfo.InvariantCulture)));
        exception.Data[ErrorCodeKey] = errorCode;
        return exception;
    }

    public static string? GetErrorCode(this Exception exception)
        => (string?)exception.Data[ErrorCodeKey];
}