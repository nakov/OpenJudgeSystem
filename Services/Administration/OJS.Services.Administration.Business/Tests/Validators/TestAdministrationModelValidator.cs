namespace OJS.Services.Administration.Business.Tests.Validators;

using OJS.Data.Models.Tests;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class TestAdministrationModelValidator : BaseAdministrationModelValidator<TestAdministrationModel, int, Test>
{
    public TestAdministrationModelValidator(IDataService<Test> dataService)
        : base(dataService)
    {
    }
}