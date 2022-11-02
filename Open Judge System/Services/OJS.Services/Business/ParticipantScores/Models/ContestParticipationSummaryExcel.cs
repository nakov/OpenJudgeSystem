using System;

namespace OJS.Services.Business.ParticipantScores.Models
{
    using System.IO;
    using System.Linq;
    using MissingFeatures;
    using NPOI.HSSF.UserModel;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using OJS.Web.Common.Extensions;
    using OJS.Common.Extensions;
    
    public class ContestParticipationSummaryExcel
    {
        public HSSFWorkbook Workbook { get; set; }
        
        public ContestParticipationSummary ContestParticipationSummary { get; set; }

        private int rowNumber = 1;
        private int preProblemsColumnsCount = 4;
        private ISheet sheet;

        public ContestParticipationSummaryExcel(ContestParticipationSummary summary)
        {
            this.ContestParticipationSummary = summary;
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
            headerRow.CreateCell(columnNumber++).SetCellValue("Username");
            headerRow.CreateCell(columnNumber++).SetCellValue("Tasks");

            Enumerable.Range(1, ContestParticipationSummary.Results.First().ProblemsCount)
            .ForEach(index =>
            {
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index}");
                headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {index} Length");
            });
                
            headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
            headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

            return columnNumber;
        }
        
        private void FillSheet()
        {
            CreateContestSummaryRows(this.ContestParticipationSummary);
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

            var problemsCount = this.ContestParticipationSummary.Results.First().ProblemsCount;
            
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