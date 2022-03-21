namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using System.Threading.Tasks;

public class ProblemResourcesDownloadValidationService : IProblemResourcesDownloadValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IProblemsValidationHelper problemsValidationHelper;

    public ProblemResourcesDownloadValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IProblemsValidationHelper problemsValidationHelper)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.problemsValidationHelper = problemsValidationHelper;
    }

    public async Task<ValidationResult> GetValidationResult(ProblemResourceDownloadServiceModel? resource)
    {
        var nullValidationResult = this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(resource, nameof(resource));

        if (!nullValidationResult.IsValid)
        {
            return nullValidationResult;
        }

        return await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(resource!.ProblemId);
    }
}