namespace OJS.Services.Common.Validation;

using OJS.Services.Common.Models;
using SoftUni.Services.Infrastructure;

public interface IValidationService<in T> : IService
{
    ValidationResult GetValidationResult(T? item);
}