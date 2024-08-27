namespace OJS.Services.Common.Implementations;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using static OJS.Services.Common.Validation.ValidationConstants;

// TODO: Add to common packages
public class NotDefaultValueValidationService : INotDefaultValueValidationService
{
    public ValidationResult GetValidationResult<T>(T value, string valueName, string? customErrorMessage)
        => value?.Equals(default(T)) ?? true
            ? ValidationResult.Invalid(
                customErrorMessage
                    ?? (value == null
                        ? string.Format(null, CannotBeNullTemplate, valueName)
                        : string.Format(null, CannotBeTemplate, valueName, value)))
            : ValidationResult.Valid();
}