namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;
using OJS.Services.Common.Models;

public interface INotDefaultValueValidationService : IService
{
    ValidationResult GetValidationResult<T>(T value, string valueName, string? customErrorMessage);
}