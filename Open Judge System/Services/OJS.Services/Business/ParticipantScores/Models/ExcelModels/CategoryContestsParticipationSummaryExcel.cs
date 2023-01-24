namespace OJS.Services.Business.ParticipantScores.Models.ExcelModels
{
    using System.Linq;
    using MissingFeatures;
    
    public class CategoryContestsParticipationSummaryExcel : ParticipationStatisticsSummaryExcelModel<CategoryContestsParticipationSummary>
    {
        public CategoryContestsParticipationSummaryExcel(CategoryContestsParticipationSummary categorySummary) : base(categorySummary)
        {
            
        }

        protected override void FillSheet()
        {
            CreateContestSummaryRows(this.Summary);
        }

        protected override int CreateResultsSheetHeaderRow()
        {
            var headerRow = sheet.CreateRow(0);
            var columnNumber = 0;
            headerRow.CreateCell(columnNumber++).SetCellValue("Contest");
            headerRow.CreateCell(columnNumber++).SetCellValue("Problems Count (Groups)");
            headerRow.CreateCell(columnNumber++).SetCellValue("Username");

            Enumerable.Range(1, Summary.MaxProblemsCount)
                .ForEach(index =>
                {
                    headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index}");
                    headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index} Length");
                });
                
            headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
            headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

            return columnNumber;
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
            
            Enumerable.Range(1, this.Summary.MaxProblemsCount)
            .ForEach(index =>
            {
                var indexToStr = index.ToString();
                var participantResults = participantSummary.ProblemToMinutesTakenToSolve;

                var colTimeTakenValue = !participantResults.ContainsKey(indexToStr)
                    ? 0
                    : participantResults[indexToStr].TimeTaken;
                
                var colLengthValue = !participantResults.ContainsKey(indexToStr)
                    ? 0
                    : participantResults[indexToStr].Length;

                row.CreateCell(colNumber++).SetCellValue(colTimeTakenValue);
                row.CreateCell(colNumber++).SetCellValue(colLengthValue);
            });

            if (colNumber - this.preProblemsColumnsCount < Summary.MaxProblemsCount)
            {
                colNumber = this.preProblemsColumnsCount + Summary.MaxProblemsCount;
            }
                    
            row.CreateCell(colNumber++).SetCellValue(participantSummary.TimeTotal);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.PointsTotal);
        }
    }
}