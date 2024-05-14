namespace OJS.Services.Administration.Business.Tests;

using OJS.Data.Models.Tests;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common.Models.Files;
using System.Threading.Tasks;

public interface ITestsBusinessService : IAdministrationOperationService<Test, int, TestAdministrationModel>
{
    Task DeleteAll(int problemId);

    Task<string> Import(TestsImportRequestModel model);

    Task<FileResponseModel> ExportZip(int problemId);
}