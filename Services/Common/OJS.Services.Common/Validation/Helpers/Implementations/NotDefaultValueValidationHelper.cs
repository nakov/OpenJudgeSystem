namespace OJS.Services.Common.Validation.Helpers.Implementations;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using static OJS.Services.Common.Validation.ValidationConstants;

public class NotDefaultValueValidationHelper : INotDefaultValueValidationHelper
{
    public ValidationResult ValidateValueIsNotDefault<T>(T? value, string valueName, string? customErrorMessage = null)
        => value?.Equals(default(T)) ?? true
            ? ValidationResult.Invalid(
                customErrorMessage
                ?? (value == null
                    ? string.Format(null, CannotBeNullTemplate, valueName)
                    : string.Format(null, CannotBeTemplate, valueName, value)))
            : ValidationResult.Valid();
}