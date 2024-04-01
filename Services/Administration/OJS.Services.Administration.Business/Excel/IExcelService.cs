namespace OJS.Services.Administration.Business.Excel
{
    using OJS.Services.Common.Models.Contests.Results;
    using OJS.Services.Common.Models.Files;
    using SoftUni.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface IExcelService : IService
    {
        Task<FileResponseModel> ExportContestResultsToExcel(ContestResultsViewModel contestResults, string fileName);
    }
}