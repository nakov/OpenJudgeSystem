namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;

public class SubmissionSimilaritiesValidationService : ISubmissionSimilaritiesValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IUserProviderService userProvider;

    public SubmissionSimilaritiesValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IUserProviderService userProvider)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
    }

    public ValidationResult GetValidationResult(Contest? contest)
        => this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest));
}