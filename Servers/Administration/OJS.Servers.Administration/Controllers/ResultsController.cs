namespace OJS.Servers.Administration.Controllers;

using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ContestsGeneral;

public class ResultsController : BaseAdminViewController
{
    private readonly IContestsDataService contestsData;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IContestResultsAggregatorCommonService contestResultsAggregator;
    private readonly Services.Administration.Business.IUserProviderService userProviderService;

    public ResultsController(
        IContestsDataService contestsData,
        IContestsBusinessService contestsBusiness,
        IContestResultsAggregatorCommonService contestResultsAggregator,
        IContestsValidationHelper contestsValidationHelper,
        Services.Administration.Business.IUserProviderService userProviderService)
    {
        this.contestsData = contestsData;
        this.contestsBusiness = contestsBusiness;
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsValidationHelper = contestsValidationHelper;
        this.userProviderService = userProviderService;
    }

    [HttpPost]
    public async Task<IActionResult> Export(ContestResultsExportRequestModel model)
    {
        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(model.Id)
            .VerifyResult();

        var contest = await this.contestsData.GetByIdWithProblems(model.Id);

        if (contest == null)
        {
            throw new BusinessServiceException(Resource.ContestNotFound);
        }

        var official = model.Type == ContestExportResultType.Compete;

        var user = this.userProviderService.GetCurrentUser();

        var contestResultsModel = new ContestResultsModel
        {
            Contest = contest,
            Official = official,
            IsUserAdminOrLecturer = user.IsAdminOrLecturer,
            IsFullResults = false,
            TotalResultsCount = null,
            IsExportResults = false,
        };

        var contestResults = this.contestResultsAggregator.GetContestResults(contestResultsModel);

        // Suggested file name in the "Save as" dialog which will be displayed to the end user
        var fileName = string.Format(
            Resource.ReportExcelFormat,
            official ? Resource.Contest : Resource.Practice,
            contest.Name);

        return await this.ExportResultsToExcel(contestResults, fileName);
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

        var maxPoints = await this.contestsData.GetMaxPointsForExportById(contestResults.Id);

        var totalPointsCellTitle = $"Total (Max: {maxPoints})";

        sheet.Cell(1, columnNumber).Value = totalPointsCellTitle;
    }

    private async Task<FileResult> ExportResultsToExcel(ContestResultsViewModel contestResults, string fileName)
    {
        using XLWorkbook workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Results");

        await this.CreateResultsSheetHeaderRow(sheet, contestResults);

        FillSheetWithParticipantResults(sheet, contestResults);

        sheet.Columns().AdjustToContents();

        // Write the workbook to a memory stream
        var outputStream = new MemoryStream();
        workbook.SaveAs(outputStream);

        // Return the result to the end user
        return this.File(
            outputStream.ToArray(), // The binary data of the XLS file
            GlobalConstants.MimeTypes.ExcelSheet, // MIME type of Excel files
            fileName);
    }
}