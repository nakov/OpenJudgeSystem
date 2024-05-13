namespace OJS.Services.Common.Validation;

using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using System.Threading.Tasks;

public interface IValidationServiceAsync<in T> : IService
{
    Task<ValidationResult> GetValidationResult(T? item);
}