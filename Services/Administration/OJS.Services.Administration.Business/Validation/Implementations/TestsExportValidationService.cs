namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using System.Threading.Tasks;

public class TestsExportValidationService : ITestsExportValidationService
{
    private readonly IProblemsValidationHelper problemsValidationHelper;

    public TestsExportValidationService(IProblemsValidationHelper problemsValidationHelper)
        => this.problemsValidationHelper = problemsValidationHelper;

    public Task<ValidationResult> GetValidationResult(ProblemShortDetailsServiceModel? item)
        => this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(item);
}