namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models.Contests;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Contests.GridData;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Business.Similarity;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class ContestsController : BaseAdminApiController<Contest, int, ContestInListModel, ContestAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly ContestAdministrationModelValidator validator;
    private readonly IContestsDataService contestsData;
    private readonly ISimilarityService similarityService;
    private readonly ContestSimilarityModelValidator similarityModelValidator;

    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        ContestAdministrationModelValidator validator,
        IContestsGridDataService contestGridDataService,
        IContestsDataService contestsData,
        ISimilarityService similarityService,
        ContestSimilarityModelValidator similarityModelValidator)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.validator = validator;
        this.contestsData = contestsData;
        this.similarityService = similarityService;
        this.similarityModelValidator = similarityModelValidator;
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetAllForProblem(string? searchString)
    {
        var contests =
            await this.contestsData
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    contest => contest.Name!.Contains(searchString ?? string.Empty))
                .MapCollection<ContestCopyProblemsValidationServiceModel>()
                .Take(20)
                .ToListAsync();
        return this.Ok(contests);
    }

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> DownloadSubmissions(DownloadSubmissionsModel model)
    {
        var file = await this.contestsBusinessService.DownloadSubmissions(model);

        return this.File(file.Content!, file.MimeType!, file.FileName);
    }

    [HttpGet]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> Activity(int contestId)
    {
        var validationResult = await this.validator
            .ValidateAsync(new ContestAdministrationModel { Id = contestId, OperationType = CrudOperationType.Read })
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        var result = await this.contestsBusinessService.GetContestActivity(contestId);
        return this.Ok(result);
    }

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> Export(ContestResultsExportRequestModel model)
    {
        var file = await this.contestsBusinessService.ExportResults(model);
        return this.File(file.Content!, file.MimeType!, file.FileName);
    }

    [HttpPost]
    [ProtectedEntityAction("model", typeof(ContestSimilarityPermissionService))]
    public async Task<ActionResult> CheckSimilarity(SimillarityCheckModel model)
    {
        var validationResult = await this.similarityModelValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        // It seems that the algorithm is not working.
        // The issue is in the DIffText method of the similarity finder.
        // For two identical submissions returns empty array and therefore the differencesCount is 0.

        // return this.Ok(this.similarityService.GetSubmissionSimilarities(model));

        return this.BadRequest("The required service is not implemented yet.");
    }
}