using System.IO;
using NPOI.HSSF.UserModel;
using OJS.Common;
using OJS.Services.Business.ParticipantScores.Models;
using OJS.Web.Common.Extensions;

namespace OJS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Web.Mvc;
    using OJS.Data;
    using OJS.Services.Business.ParticipantScores;
    using OJS.Services.Cache.Statistics;
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
        public ActionResult GetContestParticipantScoreInfo(int id, bool official)
        {
            var participations = this.participantScoresBusiness.GetParticipationSummary(id, official);

            var excel = this.GetParticipationsSummaryExcel(participations.Data);

            return this.File(
                excel.ToArray(), // The binary data of the XLS file
                GlobalConstants.ExcelMimeType, // MIME type of Excel files
                "summary.xls");
        }

        private MemoryStream GetParticipationsSummaryExcel(
            ParticipationsSummaryServiceModel participationsSummary)
        {
            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet();

            var columnsCount = CreateResultsSheetHeaderRow();

            FillSheet();

            sheet.AutoSizeColumns(columnsCount);

            // Write the workbook to a memory stream
            var outputStream = new MemoryStream();
            workbook.Write(outputStream);
            
            int CreateResultsSheetHeaderRow()
            {
                var headerRow = sheet.CreateRow(0);
                var columnNumber = 0;
                headerRow.CreateCell(columnNumber++).SetCellValue("Username");

                for (int i = 1; i <= participationsSummary.ProblemsCount; i++)
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
                foreach (var summary in participationsSummary.Results)
                {
                    var colNumber = 0;
                    var row = sheet.CreateRow(rowNumber++);
                    row.CreateCell(colNumber++).SetCellValue(summary.ParticipantName);
                    foreach (var resultPair in summary.ProblemOrderToMinutesTakenToSolve)
                    {
                        row.CreateCell(colNumber++).SetCellValue(resultPair.Value);
                    }
                    
                    row.CreateCell(colNumber++).SetCellValue(summary.TimeTotal);
                    row.CreateCell(colNumber++).SetCellValue(summary.PointsTotal == 0 ? 0 : summary.PointsTotal);
                }
            }

            return outputStream;
        }
    }
}