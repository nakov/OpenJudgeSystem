namespace OJS.Services.Administration.Business.Validation.Helpers;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsValidationHelper : IService
{
    Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId);

    Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(Contest existingContest, Contest newContest);

    Task<ValidationResult> ValidateContestIsNotActive(Contest existingContest);
}