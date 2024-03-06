namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Models.Tests;
using OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Services.Administration.Business.Tests;
using OJS.Services.Administration.Business.Tests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Common;

public class TestsController : BaseAdminApiController<Test, int, TestsInListModel, TestAdministrationModel>
{
    private readonly IGridDataService<Test> testGridDataService;
    private readonly ITestsBusinessService testsBusinessService;

    public TestsController(
        IGridDataService<Test> testGridDataService,
        ITestsBusinessService testsBusinessService,
        TestAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator)
        : base(
            testGridDataService,
            testsBusinessService,
            validator,
            deleteValidator)
    {
        this.testGridDataService = testGridDataService;
        this.testsBusinessService = testsBusinessService;
    }

    [HttpGet("{problemId:int}")]
    [ProtectedEntityAction("problemId", typeof(ProblemIdPermissionsService))]
    public async Task<IActionResult> GetByProblemId([FromQuery] PaginationRequestModel model, [FromRoute] int problemId)
        => this.Ok(
            await this.testGridDataService.GetAll<TestsInListModel>(
                model,
                test => test.Problem.Id == problemId));

    [HttpDelete("{problemId:int}")]
    [ProtectedEntityAction("problemId", typeof(ProblemIdPermissionsService))]
    public async Task<IActionResult> DeleteAll(int problemId)
    {
        await this.testsBusinessService.DeleteAll(problemId);
        return this.Ok($"Successfully deleted tests.");
    }

    [HttpPost]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> Import([FromForm]TestsImportRequestModel model)
        => this.Ok(await this.testsBusinessService.Import(model));

    [HttpGet("{problemId:int}")]
    [ProtectedEntityAction("problemId", typeof(ProblemIdPermissionsService))]
    public async Task<IActionResult> ExportZip(int problemId)
    {
        var file = await this.testsBusinessService.ExportZip(problemId);
        return this.File(file.Content!, GlobalConstants.MimeTypes.ApplicationOctetStream, file.FileName);
    }
}