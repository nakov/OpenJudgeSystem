namespace OJS.Services.Infrastructure.Models;

public class ValidationResult
{
    protected ValidationResult()
    {
    }

    public bool IsValid { get; set; } = false;

    public virtual string Message { get; set; }

    public string PropertyName { get; set; }

    public static ValidationResult Valid()
        => new ValidationResult()
        {
            IsValid = true,
        };

    public static ValidationResult Invalid(string message, string propertyName = null)
        => new ValidationResult()
        {
            Message = message,
            PropertyName = propertyName,
        };
}