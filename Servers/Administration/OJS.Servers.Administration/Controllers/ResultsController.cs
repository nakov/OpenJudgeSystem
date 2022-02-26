namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using OJS.Common;
using OJS.Common.Extensions;
using OJS.Servers.Administration.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Exceptions;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ContestsGeneral;

public class ResultsController : BaseAdminViewController
{
    private readonly IContestsDataService contestsData;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestResultsAggregatorService contestResultsAggregator;

    public ResultsController(
        IContestsDataService contestsData,
        IContestsBusinessService contestsBusiness,
        IContestResultsAggregatorService contestResultsAggregator)
    {
        this.contestsData = contestsData;
        this.contestsBusiness = contestsBusiness;
        this.contestResultsAggregator = contestResultsAggregator;
    }

    // TODO: This method does not work on linux. Remove NPOI nuget package dependency and use another alternative.
    [HttpPost]
    public async Task<IActionResult> Export(ContestResultsExportRequestModel model)
    {
        var userHasContestPermissions = await this.contestsBusiness
            .UserHasContestPermissions(model.Id, this.User.GetId(), this.User.IsAdmin());

        if (!userHasContestPermissions)
        {
            throw new BusinessServiceException(Resource.Contest_results_not_available);
        }

        var contest = await this.contestsData.GetByIdWithProblems(model.Id);

        if (contest == null)
        {
            throw new BusinessServiceException(Resource.Contest_not_found);
        }

        var official = model.Type == ContestExportResultType.Compete;

        var contestResults = this.contestResultsAggregator.GetContestResults(
            contest,
            official,
            isUserAdminOrLecturer: true,
            isFullResults: false,
            isExportResults: true);

        // Suggested file name in the "Save as" dialog which will be displayed to the end user
        var fileName = string.Format(
            Resource.Report_excel_format,
            official ? Resource.Contest : Resource.Practice,
            contest.Name);

        return this.ExportResultsToExcel(contestResults, fileName);
    }

    private int CreateResultsSheetHeaderRow(ISheet sheet, ContestResultsViewModel contestResults)
    {
        var headerRow = sheet.CreateRow(0);
        var columnNumber = 0;
        headerRow.CreateCell(columnNumber++).SetCellValue("Username");
        headerRow.CreateCell(columnNumber++).SetCellValue("Name");

        foreach (var problem in contestResults.Problems)
        {
            if (problem.IsExcludedFromHomework)
            {
                problem.Name = $"(*){problem.Name}";
            }

            headerRow.CreateCell(columnNumber++).SetCellValue(problem.Name);
        }

        var maxPoints = this.contestsData.GetMaxPointsForExportById(contestResults.Id);

        var totalPointsCellTitle = $"Total (Max: {maxPoints})";

        headerRow.CreateCell(columnNumber++).SetCellValue(totalPointsCellTitle);

        return columnNumber;
    }

    private void FillSheetWithParticipantResults(ISheet sheet, ContestResultsViewModel contestResults)
    {
        var rowNumber = 1;
        foreach (var result in contestResults.Results)
        {
            var colNumber = 0;
            var row = sheet.CreateRow(rowNumber++);
            row.CreateCell(colNumber++).SetCellValue(result.ParticipantUsername);
            row.CreateCell(colNumber++).SetCellValue(result.ParticipantFullName);

            foreach (var problem in contestResults.Problems)
            {
                var problemResult = result.ProblemResults.FirstOrDefault(pr => pr.ProblemId == problem.Id);

                if (problemResult != null)
                {
                    row.CreateCell(colNumber++).SetCellValue(problemResult.BestSubmission.Points);
                }
                else
                {
                    row.CreateCell(colNumber++, CellType.Blank);
                }
            }

            row.CreateCell(colNumber).SetCellValue(result.ExportTotal);
        }
    }

    private FileResult ExportResultsToExcel(ContestResultsViewModel contestResults, string fileName)
    {
        var workbook = new HSSFWorkbook();
        var sheet = workbook.CreateSheet();

        var columnsCount = this.CreateResultsSheetHeaderRow(sheet, contestResults);

        this.FillSheetWithParticipantResults(sheet, contestResults);

        sheet.AutoSizeColumns(columnsCount);

        // Write the workbook to a memory stream
        var outputStream = new MemoryStream();
        workbook.Write(outputStream);

        // Return the result to the end user
        return this.File(
            outputStream.ToArray(), // The binary data of the XLS file
            GlobalConstants.MimeTypes.ExcelSheet, // MIME type of Excel files
            fileName);
    }
}