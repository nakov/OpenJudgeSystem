namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;
using OJS.Services.Ui.Models.Submissions;
using System.Threading.Tasks;

public interface ITestsBusinessService : IService
{
    Task<TestSeparateDetailsServiceModel> GetTestDetails(int testId, int submissionId);
}