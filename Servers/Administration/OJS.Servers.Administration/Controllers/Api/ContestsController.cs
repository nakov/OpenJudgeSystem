namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Contests.GridData;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class ContestsController : BaseAdminApiController<Contest, int, ContestInListModel, ContestAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IContestsDataService contestsData;

    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        ContestAdministrationModelValidator validator,
        IContestsGridDataService contestGridDataService,
        ContestDeleteValidator deleteValidator,
        IContestsDataService contestsData)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator,
        deleteValidator)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.contestsData = contestsData;
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

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> Export(ContestResultsExportRequestModel model)
    {
        var file = await this.contestsBusinessService.ExportResults(model);
        return this.File(file.Content!, file.MimeType!, file.FileName);
    }
}