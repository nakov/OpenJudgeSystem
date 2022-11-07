using SoftUni.Services.Infrastructure;

namespace OJS.Services.Common.Validation;

using OJS.Services.Common.Models;
using System.Threading.Tasks;

public interface IValidationServiceAsync<in T> : IService
{
    Task<ValidationResult> GetValidationResult(T? item);
}