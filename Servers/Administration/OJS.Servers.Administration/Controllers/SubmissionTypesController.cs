namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypes.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Workers.Common.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionTypesController : BaseAdminApiController<SubmissionType, int, SubmissionTypeInListModel, SubmissionTypeAdministrationModel>
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        IGridDataService<SubmissionType> submissionTypesGridDataService,
        SubmissionTypeAdministrationModelValidator validator)
            : base(
                submissionTypesGridDataService,
                submissionTypesBusinessService,
                validator) =>
        this.submissionTypesBusinessService = submissionTypesBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetForProblem()
        => this.Ok(await this.submissionTypesBusinessService.GetForProblem());

    [HttpGet]
    public IActionResult GetCompilers()
        => this.Ok(Enum.GetNames(typeof(CompilerType)).ToList());

    [HttpGet]
    public IActionResult GetExecutionStrategies()
        => this.Ok(Enum.GetNames(typeof(ExecutionStrategyType)).ToList());
}