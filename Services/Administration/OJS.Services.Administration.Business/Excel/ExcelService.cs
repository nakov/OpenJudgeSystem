namespace OJS.Services.Administration.Business.Excel;

using ClosedXML.Excel;
using OJS.Common;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Common.Models.Files;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

public class ExcelService : IExcelService
{
    private readonly IContestsDataService contestsDataService;

    public ExcelService(IContestsDataService contestsDataService)
        => this.contestsDataService = contestsDataService;

    public async Task<FileResponseModel> ExportContestResultsToExcel(ContestResultsViewModel contestResults, string fileName)
    {
        using XLWorkbook workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Results");

        await this.CreateResultsSheetHeaderRow(sheet, contestResults);

        FillSheetWithParticipantResults(sheet, contestResults);

        sheet.Columns().AdjustToContents();

        // Write the workbook to a memory stream
        var outputStream = new MemoryStream();
        workbook.SaveAs(outputStream);

        return new FileResponseModel(outputStream.ToArray(), fileName, GlobalConstants.MimeTypes.ExcelSheet);
    }

    private static void FillSheetWithParticipantResults(IXLWorksheet sheet, ContestResultsViewModel contestResults)
    {
        var rowNumber = 2;
        foreach (var result in contestResults.Results)
        {
            var colNumber = 1;
            sheet.Cell(rowNumber, colNumber++).Value = result.ParticipantUsername;
            sheet.Cell(rowNumber, colNumber++).Value = result.ParticipantFullName;

            foreach (var problem in contestResults.Problems)
            {
                var problemResult = result.ProblemResults.FirstOrDefault(pr => pr.ProblemId == problem.Id);

                if (problemResult != null)
                {
                    sheet.Cell(rowNumber, colNumber++).Value = problemResult.BestSubmission.Points;
                }
                else
                {
                    sheet.Cell(rowNumber, colNumber++).Value = string.Empty;
                }
            }

            sheet.Cell(rowNumber, colNumber).Value = result.ExportTotal;
            rowNumber++;
        }
    }

    private async Task CreateResultsSheetHeaderRow(IXLWorksheet sheet, ContestResultsViewModel contestResults)
    {
        var columnNumber = 1;

        sheet.Cell(1, columnNumber++).Value = "Username";
        sheet.Cell(1, columnNumber++).Value = "Name";

        foreach (var problem in contestResults.Problems)
        {
            if (problem.IsExcludedFromHomework)
            {
                problem.Name = $"(*){problem.Name}";
            }

            sheet.Cell(1, columnNumber++).Value = problem.Name;
        }

        var maxPoints = await this.contestsDataService.GetMaxPointsForExportById(contestResults.Id);

        var totalPointsCellTitle = $"Total (Max: {maxPoints})";

        sheet.Cell(1, columnNumber).Value = totalPointsCellTitle;
    }
}