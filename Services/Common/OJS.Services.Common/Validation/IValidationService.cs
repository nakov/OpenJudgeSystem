namespace OJS.Services.Common.Validation;

using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public interface IValidationService<in T> : IService
{
    ValidationResult GetValidationResult(T? item);
}