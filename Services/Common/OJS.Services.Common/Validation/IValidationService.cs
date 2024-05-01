namespace OJS.Services.Common.Validation;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using SoftUni.Services.Infrastructure;

public interface IValidationService<in T> : IService
{
    ValidationResult GetValidationResult(T? item);
}