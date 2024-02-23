namespace OJS.Services.Administration.Business.Tests;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class TestsBusinessService : AdministrationOperationService<Test, int, TestAdministrationModel>, ITestsBusinessService
{
    private readonly ITestsDataService testsDataService;

    public TestsBusinessService(ITestsDataService testsDataService)
        => this.testsDataService = testsDataService;

    public override async Task<TestAdministrationModel> Get(int id)
    {
        var test = await this.testsDataService.GetByIdQuery(id)
            .Include(t => t.Problem)
            .FirstOrDefaultAsync();

        if (test is null)
        {
            throw new BusinessServiceException($"Test with id: {id} not found.");
        }

        return test.Map<TestAdministrationModel>();
    }
}