namespace OJS.Services.Administration.Data.Excel;

using ClosedXML.Excel;
using NPOI.HSSF.UserModel;
using OJS.Common;
using OJS.Common.Extensions;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Common.Models.Files;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

    public FileResponseModel ExportResults<TModel>(IEnumerable<TModel?> items)
    {
            Type dataType = items.GetType().GetGenericArguments()[0];

            var dataTypeProperties = dataType.GetProperties();

            // Create new Excel workbook
            var workbook = new HSSFWorkbook();

            // Create new Excel sheet
            var sheet = workbook.CreateSheet();

            // Create a header row
            var headerRow = sheet.CreateRow(0);
            int columnNumber = 0;
            foreach (var property in dataTypeProperties)
            {
                string cellName = property.Name;
                object[] attributes = property.GetCustomAttributes(typeof(DisplayAttribute), true);
                if (attributes.Any())
                {
                    var attribute = attributes[0] as DisplayAttribute;
                    if (attribute != null)
                    {
                        cellName = attribute.Name ?? property.Name;
                    }
                }

                headerRow.CreateCell(columnNumber++).SetCellValue(cellName);
            }

            // (Optional) freeze the header row so it is not scrolled
            sheet.CreateFreezePane(0, 1, 0, 1);

            int rowNumber = 1;

            // Populate the sheet with values from the grid data
            foreach (object? item in items)
            {
                // Create a new row
                var row = sheet.CreateRow(rowNumber++);

                int cellNumber = 0;
                foreach (var property in dataTypeProperties)
                {
                    object propertyValue = item?.GetType()?.GetProperty(property.Name)!.GetValue(item, null)!;
                    if (propertyValue == null)
                    {
                        row.CreateCell(cellNumber).SetCellType(NPOI.SS.UserModel.CellType.Blank);
                    }
                    else
                    {
                        var cell = row.CreateCell(cellNumber);
                        double value;
                        var typeCode = Type.GetTypeCode(property.PropertyType);
                        if (typeCode == TypeCode.Single || typeCode == TypeCode.Char)
                        {
                            cell.SetCellValue(propertyValue.ToString());
                        }

                        if (double.TryParse(propertyValue.ToString(), out value))
                        {
                            cell.SetCellValue(value);
                            cell.SetCellType(NPOI.SS.UserModel.CellType.Numeric);
                        }
                        else if (typeCode == TypeCode.DateTime)
                        {
                            cell.SetCellValue((DateTime)propertyValue);
                        }
                        else
                        {
                            string propertyValueAsString = propertyValue.ToString()!;
                            if (propertyValue.ToString()!.Length > 10000)
                            {
                                propertyValueAsString = "THIS CELL DOES NOT CONTAIN FULL INFORMATION: " + propertyValueAsString.Substring(0, 10000);
                            }

                            cell.SetCellValue(propertyValueAsString);
                        }
                    }

                    cellNumber++;
                }
            }

            sheet.AutoSizeColumns(columnNumber);

            // Write the workbook to a memory stream
            var outputStream = new MemoryStream();
            workbook.Write(outputStream);

            // Return the result to the end user
            return new FileResponseModel(
                outputStream.ToArray(), // The binary data of the XLS file
                string.Format("{0}.xls", this.GetType().Name),
                GlobalConstants.MimeTypes.ExcelSheet);
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