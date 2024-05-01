namespace OJS.Services.Common.Validation.Helpers;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using SoftUni.Services.Infrastructure;

public interface INotDefaultValueValidationHelper : IService
{
    ValidationResult ValidateValueIsNotDefault<T>(T? value, string valueName, string? customErrorMessage = null);
}