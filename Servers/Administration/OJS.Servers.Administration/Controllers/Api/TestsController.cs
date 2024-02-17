namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using OJS.Data.Models.Tests;
using OJS.Services.Administration.Business.Tests;
using OJS.Services.Administration.Business.Tests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Administration.Models.Validation;

public class TestsController : BaseAdminApiController<Test, int, TestsInListModel, TestAdministrationModel>
{
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
    }
}