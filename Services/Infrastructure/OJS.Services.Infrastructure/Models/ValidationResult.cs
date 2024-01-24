namespace OJS.Services.Infrastructure.Models;

public class ValidationResult
{
    public bool IsValid { get; set; } = false;

    public virtual string Message { get; set; } = null!;

    public string? PropertyName { get; set; } = null!;

    public static ValidationResult Valid()
        => new() { IsValid = true };

    public static ValidationResult Invalid(string message, string? propertyName = null)
        => new() { Message = message, PropertyName = propertyName };
}