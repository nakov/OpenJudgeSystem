namespace OJS.Services.Common.Validation;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IValidationServiceAsync<in T> : IService
{
    Task<ValidationResult> GetValidationResult(T? item);
}