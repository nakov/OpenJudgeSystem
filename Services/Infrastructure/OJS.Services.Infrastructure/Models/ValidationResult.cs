namespace OJS.Services.Infrastructure.Models;

public class ValidationResult
{
    protected ValidationResult()
    {
    }

    public bool IsValid { get; set; }

    public virtual string Message { get; set; } = string.Empty;

    public string? PropertyName { get; set; }

    public static ValidationResult Valid()
        => new()
        {
            IsValid = true,
        };

    public static ValidationResult Invalid(string message, string? propertyName = null)
        => new()
        {
            Message = message,
            PropertyName = propertyName,
        };
}