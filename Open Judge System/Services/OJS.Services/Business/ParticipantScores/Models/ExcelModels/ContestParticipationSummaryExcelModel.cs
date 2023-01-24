namespace OJS.Services.Business.ParticipantScores.Models.ExcelModels
{
    using System;
    using System.Linq;
    using MissingFeatures;
    using OJS.Common.Extensions;
    
    public class ContestParticipationSummaryExcelModel : ParticipationStatisticsSummaryExcelModel<ContestParticipationSummary>
    {
        public ContestParticipationSummaryExcelModel(ContestParticipationSummary summary) : base(summary)
        {
            
        }

        protected override int CreateResultsSheetHeaderRow()
        {
            var headerRow = sheet.CreateRow(0);
            var columnNumber = 0;
            headerRow.CreateCell(columnNumber++).SetCellValue("Contest");
            headerRow.CreateCell(columnNumber++).SetCellValue("Username");
            headerRow.CreateCell(columnNumber++).SetCellValue("Tasks");

            Enumerable.Range(1, Summary.Results.First().ProblemsCount)
            .ForEach(index =>
            {
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index}");
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index} Length");
            });
                
            headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
            headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

            return columnNumber;
        }
        
        protected override void FillSheet()
        {
            CreateContestSummaryRows(this.Summary);
        }
        
        private void CreateContestSummaryRows(ContestParticipationSummary contestSummary)
        {
            contestSummary.Results.ForEach((result) =>
            {
                var participantDataByProblemGroup = result
                    .ProblemToMinutesTakenToSolve
                    .GroupBy(v => v.Value.ProblemGroup);

                var shouldPermutateData = participantDataByProblemGroup.Any(group => group.Count() > 1);

                if (shouldPermutateData)
                {
                    participantDataByProblemGroup
                        .Select(g => g.ToList())
                        .CrossProduct()
                        .ForEach(combination => CreateParticipantSummaryRow(new ParticipantScoresSummaryModel
                        {
                            ParticipantName = result.ParticipantName,
                            ContestName = result.ContestName,
                            ProblemsCount = result.ProblemsCount,
                            PointsTotal = result.PointsTotal,
                            ProblemToMinutesTakenToSolve = combination.ToDictionary(
                                k => k.Key,
                                v => v.Value),
                            TimeTotal = combination.Sum(c => c.Value.TimeTaken)
                        }));
                }
                else
                {
                    CreateParticipantSummaryRow(result);
                }
            });
        }
        
        private void CreateParticipantSummaryRow(ParticipantScoresSummaryModel participantSummary)
        {
            var row = sheet.CreateRow(rowNumber++);
            var colNumber = 0;

            row.CreateCell(colNumber++).SetCellValue(participantSummary.ContestName);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.ParticipantName);
            
            var solvedTasks = participantSummary
                .ProblemToMinutesTakenToSolve
                .Select(kv => kv.Key);
            row.CreateCell(colNumber++).SetCellValue(String.Join("/ ", solvedTasks));

            var problemsCount = this.Summary.Results.First().ProblemsCount;
            
            Enumerable.Range(1, problemsCount)
            .ForEach(index =>
            {
                var participantResultsByProblemGroup = participantSummary
                    .ProblemToMinutesTakenToSolve
                    .ToDictionary(
                        k => k.Value.ProblemGroup,
                        v => v.Value);

                var colTimeTakenValue = !participantResultsByProblemGroup.ContainsKey(index)
                    ? 0
                    : participantResultsByProblemGroup[index].TimeTaken;
                
                var colLengthValue = !participantResultsByProblemGroup.ContainsKey(index)
                    ? 0
                    : participantResultsByProblemGroup[index].Length;

                row.CreateCell(colNumber++).SetCellValue(colTimeTakenValue);
                row.CreateCell(colNumber++).SetCellValue(colLengthValue);
            });

            if (colNumber - this.preProblemsColumnsCount < problemsCount)
            {
                colNumber = this.preProblemsColumnsCount + problemsCount;
            }
                    
            row.CreateCell(colNumber++).SetCellValue(participantSummary.TimeTotal);
            row.CreateCell(colNumber++).SetCellValue(participantSummary.PointsTotal);
        }
    }
}