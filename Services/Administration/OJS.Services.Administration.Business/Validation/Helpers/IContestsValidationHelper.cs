namespace OJS.Services.Administration.Business.Validation.Helpers;

using OJS.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Models;

public interface IContestsValidationHelper : IService
{
    Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId);
}