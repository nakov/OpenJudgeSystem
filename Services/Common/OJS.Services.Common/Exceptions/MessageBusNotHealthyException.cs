namespace OJS.Services.Common.Exceptions;

using System;

public class MessageBusNotHealthyException : Exception
{
    private const string DefaultMessage = "The message bus is not in a healthy state.";

    public MessageBusNotHealthyException()
        : base(DefaultMessage)
    {
    }

    public MessageBusNotHealthyException(string message)
        : base(message)
    {
    }
}