namespace OJS.Services.Common;

using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public interface INotDefaultValueValidationService : IService
{
    ValidationResult GetValidationResult<T>(T value, string valueName, string? customErrorMessage);
}