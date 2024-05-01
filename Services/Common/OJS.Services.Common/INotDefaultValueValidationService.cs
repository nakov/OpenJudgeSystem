namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public interface INotDefaultValueValidationService : IService
{
    ValidationResult GetValidationResult<T>(T value, string valueName, string? customErrorMessage);
}