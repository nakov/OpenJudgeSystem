namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.SubmissionTypes;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Ui.Business.Cache;

public class SubmissionTypesController : Controller
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusiness;
    private readonly ISubmissionTypesCacheService submissionTypesCache;

    public SubmissionTypesController(
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        ISubmissionTypesCacheService submissionTypesCache)
    {
        this.submissionTypesBusiness = submissionTypesBusinessService;
        this.submissionTypesCache = submissionTypesCache;
    }

    public async Task<IEnumerable<SubmissionTypeResponseModel>> GetAllowedForProblem(int problemId)
        => await this.submissionTypesBusiness
            .GetAllowedSubmissionTypes(problemId)
            .MapCollection<SubmissionTypeResponseModel>();

    public async Task<IEnumerable<SubmissionTypeFilterResponseModel>> GetAll()
        => await this.submissionTypesCache
            .GetAllByUsage()
            .MapCollection<SubmissionTypeFilterResponseModel>();
}