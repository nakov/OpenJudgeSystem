namespace OJS.Services.Infrastructure.Exceptions;

using System;

public class CircuitBreakerNotOpenException : Exception
{
    private const string DefaultMessage = "The circuit breaker is not open yet.";

    public CircuitBreakerNotOpenException()
        : base(DefaultMessage)
    {
    }

    public CircuitBreakerNotOpenException(string message)
        : base(message)
    {
    }
}