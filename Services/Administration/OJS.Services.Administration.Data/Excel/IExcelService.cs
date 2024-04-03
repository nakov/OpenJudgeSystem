namespace OJS.Services.Administration.Data.Excel
{
    using OJS.Services.Common.Models.Contests.Results;
    using OJS.Services.Common.Models.Files;
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IExcelService : IService
    {
        Task<FileResponseModel> ExportContestResultsToExcel(ContestResultsViewModel contestResults, string fileName);

        FileResponseModel ExportResults<TModel>(IEnumerable<TModel?> items);
    }
}