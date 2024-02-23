namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.Tests;
using OJS.Services.Administration.Business.Tests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;

public class TestsController : BaseAdminApiController<Test, int, TestsInListModel, TestAdministrationModel>
{
    private readonly IGridDataService<Test> testGridDataService;

    public TestsController(
        IGridDataService<Test> testGridDataService,
        ITestsBusinessService testsBusinessService,
        TestAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator)
        : base(
            testGridDataService,
            testsBusinessService,
            validator,
            deleteValidator) =>
        this.testGridDataService = testGridDataService;

    [HttpGet("{problemId:int}")]
    [ProtectedEntityAction("problemId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> GetByProblemId([FromQuery] PaginationRequestModel model, [FromRoute] int problemId)
        => this.Ok(
            await this.testGridDataService.GetAll<TestsInListModel>(
                model,
                test => test.Problem.Id == problemId));
}