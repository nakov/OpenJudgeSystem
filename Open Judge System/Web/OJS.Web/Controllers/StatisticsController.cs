namespace OJS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Web.Mvc;
    using NPOI.HSSF.UserModel;
    using OJS.Common;
    using OJS.Data;
    using OJS.Services.Business.ParticipantScores;
    using OJS.Services.Business.ParticipantScores.Models;
    using OJS.Services.Cache.Statistics;
    using OJS.Web.Common.Extensions;
    using OJS.Web.ViewModels.Statistics;

    public class StatisticsController : BaseController
    {
        private readonly ISubmissionStatisticsCacheService submissionStatisticsCache;
        private readonly IParticipantScoresBusinessService participantScoresBusiness;

        public StatisticsController(
            IOjsData data, 
            ISubmissionStatisticsCacheService submissionStatisticsCache, 
            IParticipantScoresBusinessService participantScoresBusiness)
            : base(data)
        {
            this.submissionStatisticsCache = submissionStatisticsCache;
            this.participantScoresBusiness = participantScoresBusiness;
        }

        public ActionResult Index()
        {
            return this.View();
        }

        [HttpPost]
        public ActionResult GetLatestTwelveMonthSubmissionsCount()
        {
            var result = new List<SubmissionsStatisticsViewModel>();
            var currentCulture = Thread.CurrentThread.CurrentUICulture;

            this.submissionStatisticsCache
                .GetSubsmissionsCountByMonthForPastYear()
                .ToList()
                .ForEach(x =>
                {
                    var month = new DateTime(1, x.MonthNumber, 1).ToString("MMM", currentCulture);
                    result.Add(new SubmissionsStatisticsViewModel(month, x.TotalSubmissionsCount));
                });

            return this.Json(result);
        }

        [HttpPost]
        public ActionResult GetContestCategoryContestsParticipantScoreInfo(int id, bool showHidden = true)
        {
            var categoryParticipationSummary = this.participantScoresBusiness.GetCategoryParticipationSummary(id, showHidden);

            var excel = this.GetParticipationsSummaryExcel(categoryParticipationSummary);
            
            return this.File(
                excel.ToArray(),
                GlobalConstants.ExcelMimeType,
                "summary.xls");
        }

        private MemoryStream GetParticipationsSummaryExcel(
            CategoryContestsParticipationSummary categoryParticipationSummary)
        {
            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet();

            var columnsCount = CreateResultsSheetHeaderRow();

            FillSheet();

            sheet.AutoSizeColumns(columnsCount);

            var outputStream = new MemoryStream();
            workbook.Write(outputStream);
            
            int CreateResultsSheetHeaderRow()
            {
                var headerRow = sheet.CreateRow(0);
                var columnNumber = 0;
                headerRow.CreateCell(columnNumber++).SetCellValue("Contest");
                headerRow.CreateCell(columnNumber++).SetCellValue("Problems Count (Groups)");
                headerRow.CreateCell(columnNumber++).SetCellValue("Username");

                for (int i = 1; i <= categoryParticipationSummary.MaxProblemsCount; i++)
                {
                    headerRow.CreateCell(columnNumber++).SetCellValue($"Problem {i}");
                }
                
                headerRow.CreateCell(columnNumber++).SetCellValue("Time Total");
                headerRow.CreateCell(columnNumber++).SetCellValue("Points Total");

                return columnNumber;
            }
            
            void FillSheet()
            {
                var rowNumber = 1;
                foreach (var contestSummary in categoryParticipationSummary.Results)
                {
                    foreach (var participantSummary in contestSummary.Results)
                    {
                        var row = sheet.CreateRow(rowNumber++);
                        var colNumber = 0;
                        row.CreateCell(colNumber++).SetCellValue(contestSummary.ContestName);
                        row.CreateCell(colNumber++).SetCellValue(contestSummary.ProblemsCount);
                        string participantName = participantSummary.ParticipantName;
                        row.CreateCell(colNumber++).SetCellValue(participantName);
                        foreach (var resultPair in participantSummary.ProblemOrderToMinutesTakenToSolve)
                        {
                            row.CreateCell(colNumber++).SetCellValue(resultPair.Value);
                        }
                        
                        if (colNumber - 3 < categoryParticipationSummary.MaxProblemsCount)
                        {
                            colNumber = 3 + categoryParticipationSummary.MaxProblemsCount;
                        }
                    
                        row.CreateCell(colNumber++).SetCellValue(participantSummary.TimeTotal);
                        row.CreateCell(colNumber++).SetCellValue(participantSummary.PointsTotal == 0 ? 0 : participantSummary.PointsTotal);
                    }
                }
            }

            return outputStream;
        }
    }
}