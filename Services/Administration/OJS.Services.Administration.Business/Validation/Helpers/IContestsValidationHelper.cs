namespace OJS.Services.Administration.Business.Validation.Helpers;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Common.Models;

public interface IContestsValidationHelper : IService
{
    Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId);
}