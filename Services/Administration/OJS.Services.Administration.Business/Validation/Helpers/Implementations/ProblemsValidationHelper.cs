namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using System.Threading.Tasks;

public class ProblemsValidationHelper : IProblemsValidationHelper
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IProblemsDataService problemsData;

    public ProblemsValidationHelper(
        IContestsValidationHelper contestsValidationHelper,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IProblemsDataService problemsData)
    {
        this.contestsValidationHelper = contestsValidationHelper;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.problemsData = problemsData;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int problemId)
        => await this.ValidatePermissionsOfCurrentUser(
            await this.problemsData.OneByIdTo<ProblemShortDetailsServiceModel>(problemId));

    public Task<ValidationResult> ValidateRetest() => throw new System.NotImplementedException();

    public Task<ValidationResult> ValidatePermissionsOfCurrentUser(ProblemShortDetailsServiceModel? problem)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(problem, nameof(problem))
            .VerifyResult();

        return this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(problem!.ContestId);
    }
}