using System.IO;
using MissingFeatures;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using OJS.Web.Common.Extensions;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class CategoryContestsParticipationSummaryExcel
    {
        public HSSFWorkbook Workbook { get; set; }
        
        public CategoryContestsParticipationSummary CategorySummary { get; set; }
        
        private int rowNumber = 1;
        private ISheet sheet;

        public CategoryContestsParticipationSummaryExcel(CategoryContestsParticipationSummary categorySummary)
        {
            this.CategorySummary = categorySummary;
            Create();
        }
        
        public void Create()
        {
            this.Workbook = new HSSFWorkbook();
            this.sheet = Workbook.CreateSheet();
            var columnsCount = CreateResultsSheetHeaderRow();

            FillSheet();

            sheet.AutoSizeColumns(columnsCount);
        }

        public MemoryStream GetAsStream()
        {
            var outputStream = new MemoryStream();
            Workbook.Write(outputStream);
            
            return outputStream;
        }

        int CreateResultsSheetHeaderRow()
        {
            var headerRow = sheet.CreateRow(0);
            var columnNumber = 0;
            headerRow.CreateCell(columnNumber++).SetCellValue("Contest");
            headerRow.CreateCell(columnNumber++).SetCellValue("Problems Count (Groups)");
            headerRow.CreateCell(columnNumber++).SetCellValue("Username");

            for (int i = 1; i <= CategorySummary.MaxProblemsCount; i++)
            {
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {i}");
            }
                
            headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
            headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

            return columnNumber;
        }
        
        void FillSheet()
        {
            CategorySummary.Results.ForEach(contestSummary => CreateContestSummaryRows(contestSummary));
        }
        
        void CreateContestSummaryRows(ParticipationsSummaryServiceModel contestSummary)
        {
            contestSummary.Results.ForEach((participantSummary) => CreateParticipantSummaryRow(contestSummary, participantSummary));
        }
        
        void CreateParticipantSummaryRow(ParticipationsSummaryServiceModel contestSummary, ParticipantScoresSummaryModel participantSummary)
        {
            var row = sheet.CreateRow(rowNumber++);
            var colNumber = 0;
            row.CreateCell(colNumber++).SetCellValue(contestSummary.ContestName);
            row.CreateCell(colNumber++).SetCellValue(contestSummary.ProblemsCount);
            string participantName = participantSummary.ParticipantName;
            row.CreateCell(colNumber++).SetCellValue(participantName);

            participantSummary.ProblemOrderToMinutesTakenToSolve.ForEach(resultPair => row.CreateCell(colNumber++).SetCellValue(resultPair.Value));

            if (colNumber - 3 < CategorySummary.MaxProblemsCount)
            {
                colNumber = 3 + CategorySummary.MaxProblemsCount;
            }
                    
            row.CreateCell(colNumber++).SetCellValue(participantSummary.TimeTotal);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.PointsTotal == 0 ? 0 : participantSummary.PointsTotal);
        }
    }
}