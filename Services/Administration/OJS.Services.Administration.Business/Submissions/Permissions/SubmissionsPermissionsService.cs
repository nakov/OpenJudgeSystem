namespace OJS.Services.Administration.Business.Submissions.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SubmissionsPermissionsService : IEntityPermissionsService<Submission, int>
{
    private readonly IProblemsValidationHelper problemsValidationHelper;
    private readonly ISubmissionsDataService submissionsDataService;

    public SubmissionsPermissionsService(
        IProblemsValidationHelper problemsValidationHelper,
        ISubmissionsDataService submissionsDataService)
    {
        this.problemsValidationHelper = problemsValidationHelper;
        this.submissionsDataService = submissionsDataService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation)
    {
        var submission = await this.submissionsDataService.OneById(value);

        if (submission == null)
        {
            return false;
        }

        var validationResult =
            await this.problemsValidationHelper.ValidatePermissionsOfCurrentUser(submission.ProblemId);

        return validationResult.IsValid;
    }
}