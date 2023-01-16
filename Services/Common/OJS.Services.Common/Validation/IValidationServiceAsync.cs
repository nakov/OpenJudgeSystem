namespace OJS.Services.Common.Validation;

using OJS.Services.Common.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IValidationServiceAsync<in T> : IService
{
    Task<ValidationResult> GetValidationResult(T? item);
}