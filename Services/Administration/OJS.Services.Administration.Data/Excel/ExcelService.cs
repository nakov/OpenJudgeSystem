namespace OJS.Services.Administration.Data.Excel;

using ClosedXML.Excel;
using OJS.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Common.Models.Files;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.FileExtensions;

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

    public FileResponseModel ExportResults<TModel>(Dictionary<string, IEnumerable<TModel?>> data)
    {
        // Create new Excel workbook
        var workbook = new XLWorkbook();

        foreach (var sheetName in data.Keys)
        {
            WriteData(data[sheetName], workbook, sheetName);
        }

        // Write the workbook to a memory stream
        var outputStream = new MemoryStream();

        workbook.SaveAs(outputStream);

        // Return the result to the end user
        return new FileResponseModel(
            outputStream.ToArray(), // The binary data of the XLSX file
            $"{this.GetType().Name}{Excel}",
            GlobalConstants.MimeTypes.ExcelSheet);
    }

    private static void WriteData<TModel>(IEnumerable<TModel?> items, XLWorkbook workbook, string sheetName)
    {
        Type dataType = items.GetType().GetGenericArguments()[0];

        var dataTypeProperties = dataType.GetProperties();

        /*
         * Create new Excel sheet.
         * The maximum length for the Excel sheet's name is 31 characters.
         */
        var sheet = workbook.Worksheets.Add(sheetName.Length > 31 ? sheetName.Substring(0, 31) : sheetName);

        // Create a header row
        var columnNumber = 1;
        foreach (var property in dataTypeProperties)
        {
            var cellName = property.Name;
            var attributes = property.GetCustomAttributes(typeof(DisplayAttribute), true);
            if (attributes.Length != 0)
            {
                if (attributes[0] is DisplayAttribute attribute)
                {
                    cellName = attribute.Name ?? property.Name;
                }
            }

            sheet.Cell(1, columnNumber++).Value = cellName;
        }

        var rowNumber = 2;

        // Populate the sheet with values from the grid data
        foreach (object? item in items)
        {
            // Create a new row
            var row = sheet.Row(rowNumber++);

            var cellNumber = 1;
            foreach (var property in dataTypeProperties)
            {
                var propertyValue = item?.GetType().GetProperty(property.Name)?.GetValue(item, null);
                if (propertyValue == null)
                {
                    sheet.Cell(row.RowNumber(), cellNumber).Value = string.Empty;
                }
                else
                {
                    var typeCode = Type.GetTypeCode(property.PropertyType);
                    if (typeCode == TypeCode.Single || typeCode == TypeCode.Char)
                    {
                        sheet.Cell(row.RowNumber(), cellNumber).Value = propertyValue.ToString();
                    }

                    if (double.TryParse(propertyValue.ToString(), out var value))
                    {
                        sheet.Cell(row.RowNumber(), cellNumber).Value = value;
                    }
                    else if (typeCode == TypeCode.DateTime)
                    {
                        sheet.Cell(row.RowNumber(), cellNumber).Value = (DateTime)propertyValue;
                    }
                    else
                    {
                        var propertyValueAsString = propertyValue.ToString()!;
                        if (propertyValue.ToString()!.Length > 10000)
                        {
                            propertyValueAsString = string.Concat("THIS CELL DOES NOT CONTAIN FULL INFORMATION: ", propertyValueAsString.AsSpan(0, 10000));
                        }

                        sheet.Cell(row.RowNumber(), cellNumber).Value = propertyValueAsString;
                    }
                }

                cellNumber++;
            }
        }

        sheet.Columns().AdjustToContents();
    }

    private static void FillSheetWithParticipantResults(IXLWorksheet sheet, ContestResultsViewModel contestResults)
    {
        var rowNumber = 2;
        foreach (var result in contestResults.PagedResults.Items)
        {
            var colNumber = 1;
            sheet.Cell(rowNumber, colNumber++).Value = result.ParticipantUsername;
            sheet.Cell(rowNumber, colNumber++).Value = result.ParticipantFullName;
            sheet.Cell(rowNumber, colNumber++).Value = result.ParticipantEmail;

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
        sheet.Cell(1, columnNumber++).Value = "Email";

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