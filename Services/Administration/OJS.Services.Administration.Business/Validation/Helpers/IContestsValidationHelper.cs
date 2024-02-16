namespace OJS.Services.Administration.Business.Validation.Helpers;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.Contests;

public interface IContestsValidationHelper : IService
{
    Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId);

    // For deletion after new addministration is added.
    Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(Contest existingContest, Contest newContest);

    Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(Contest existingContest, ContestAdministrationModel newContest);

    Task<ValidationResult> ValidateContestIsNotActive(Contest existingContest);
}