namespace OJS.Services.Business.ParticipantScores.Models
{
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using MissingFeatures;
    using NPOI.HSSF.UserModel;
    using NPOI.SS.UserModel;
    using OJS.Web.Common.Extensions;
    
    public class CategoryContestsParticipationSummaryExcel
    {
        public HSSFWorkbook Workbook { get; set; }
        
        public CategoryContestsParticipationSummary CategorySummary { get; set; }
        
        private int rowNumber = 1;
        private int preProblemsColumnsCount = 3;
        private ISheet sheet;

        public CategoryContestsParticipationSummaryExcel(CategoryContestsParticipationSummary categorySummary)
        {
            this.CategorySummary = categorySummary;
            this.Create();
        }

        public MemoryStream GetAsStream()
        {
            var outputStream = new MemoryStream();
            Workbook.Write(outputStream);
            
            return outputStream;
        }
        
        private void Create()
        {
            this.Workbook = new HSSFWorkbook();
            this.sheet = Workbook.CreateSheet();
            var columnsCount = CreateResultsSheetHeaderRow();

            FillSheet();

            sheet.AutoSizeColumns(columnsCount);
        }

        private int CreateResultsSheetHeaderRow()
        {
            var headerRow = sheet.CreateRow(0);
            var columnNumber = 0;
            headerRow.CreateCell(columnNumber++).SetCellValue("Contest");
            headerRow.CreateCell(columnNumber++).SetCellValue("Problems Count (Groups)");
            headerRow.CreateCell(columnNumber++).SetCellValue("Username");

            Enumerable.Range(1, CategorySummary.MaxProblemsCount)
            .ForEach(index =>
            {
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index}");
            });
                
            headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
            headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

            return columnNumber;
        }
        
        private void FillSheet()
        {
            CreateContestSummaryRows(this.CategorySummary);
        }
        
        private void CreateContestSummaryRows(CategoryContestsParticipationSummary contestSummary)
        {
            contestSummary.Results.ForEach(CreateParticipantSummaryRow);
        }
        
        private void CreateParticipantSummaryRow(ParticipantScoresSummaryModel participantSummary)
        {
            var row = sheet.CreateRow(rowNumber++);
            var colNumber = 0;
            row.CreateCell(colNumber++).SetCellValue(participantSummary.ContestName);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.ProblemsCount);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.ParticipantName);
            
            Enumerable.Range(1, this.CategorySummary.MaxProblemsCount)
            .ForEach(index =>
            {
                var participantResults = participantSummary.ProblemOrderToMinutesTakenToSolve;

                var colValue = !participantResults.ContainsKey(index) || participantResults[index] == 0
                    ? 0
                    : participantResults[index];

                row.CreateCell(colNumber++).SetCellValue(colValue);
            });

            if (colNumber - this.preProblemsColumnsCount < CategorySummary.MaxProblemsCount)
            {
                colNumber = this.preProblemsColumnsCount + CategorySummary.MaxProblemsCount;
            }
                    
            row.CreateCell(colNumber++).SetCellValue(participantSummary.TimeTotal);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.PointsTotal);
        }
    }
}