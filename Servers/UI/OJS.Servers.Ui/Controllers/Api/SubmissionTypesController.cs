using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.SubmissionTypes;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Controllers.Api;

public class SubmissionTypesController : Controller
{
    private ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(ISubmissionTypesBusinessService submissionTypesBusinessService)
        => this.submissionTypesBusinessService = submissionTypesBusinessService;

    public async Task<IEnumerable<SubmissionTypeResponseModel>> GetAllowedForProblem(int problemId)
        => await this.submissionTypesBusinessService
            .GetAllowedSubmissionTypes(problemId)
            .MapCollection<SubmissionTypeResponseModel>();
}