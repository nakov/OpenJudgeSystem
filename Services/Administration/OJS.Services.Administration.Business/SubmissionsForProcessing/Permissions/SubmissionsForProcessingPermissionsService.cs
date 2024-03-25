namespace OJS.Services.Administration.Business.SubmissionsForProcessing.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Exceptions;
using System.Threading.Tasks;

public class SubmissionsForProcessingPermissionsService : IEntityPermissionsService<SubmissionForProcessing, int>
{
    private readonly IProblemsValidationHelper problemsValidationHelper;
    private readonly ISubmissionsDataService submissionsDataService;
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingDataService;

    public SubmissionsForProcessingPermissionsService(
        IProblemsValidationHelper problemsValidationHelper,
        ISubmissionsDataService submissionsDataService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingDataService)
    {
        this.problemsValidationHelper = problemsValidationHelper;
        this.submissionsDataService = submissionsDataService;
        this.submissionsForProcessingDataService = submissionsForProcessingDataService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation)
    {
        var submissionForProcessing = await this.submissionsForProcessingDataService.Get(value);

        var submission = await this.submissionsDataService
            .OneById(submissionForProcessing.SubmissionId);

        if (submission == null)
        {
            throw new BusinessServiceException(
                "Submission is missing or deleted. Unable to validate permission rights.");
        }

        var validationResult =
            await this.problemsValidationHelper.ValidatePermissionsOfCurrentUser(submission.ProblemId);

        return validationResult.IsValid;
    }
}