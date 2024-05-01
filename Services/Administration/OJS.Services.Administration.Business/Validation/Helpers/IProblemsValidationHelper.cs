namespace OJS.Services.Administration.Business.Validation.Helpers;

using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IProblemsValidationHelper : IService
{
    Task<ValidationResult> ValidatePermissionsOfCurrentUser(int problemId);

    Task<ValidationResult> ValidatePermissionsOfCurrentUser(ProblemShortDetailsServiceModel? problem);
}