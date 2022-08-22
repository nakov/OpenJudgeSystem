using System.IO;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using OJS.Common;
using OJS.Services.Business.ParticipantScores.Models;
using OJS.Web.Areas.Contests.ViewModels.Results;
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
    using OJS.Services.Business.Submissions;
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
        [Authorize]
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
            IEnumerable<ParticipantScoresSummary> participantScoresSummaries)
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
            
                var fieldNames = typeof(ParticipantScoresSummary)
                    .GetProperties()
                    .Select(f => f.Name)
                    .ToList()
                    .OrderBy(s => s);
            
                foreach (var fieldName in fieldNames)
                {
                    headerRow.CreateCell(columnNumber++).SetCellValue(fieldName);
                }

                return columnNumber;
            }
            
            void FillSheet()
            {
                var rowNumber = 1;
                foreach (var summary in participantScoresSummaries)
                {
                    var colNumber = 0;
                    var row = sheet.CreateRow(rowNumber++);
                    row.CreateCell(colNumber++).SetCellValue(summary.CreatedOn);
                    row.CreateCell(colNumber++).SetCellValue(summary.ModifiedOn);
                    row.CreateCell(colNumber++).SetCellValue(summary.ParticipantId);
                    row.CreateCell(colNumber++).SetCellValue(summary.ParticipantName);
                    row.CreateCell(colNumber++).SetCellValue(summary.Points);
                    row.CreateCell(colNumber++).SetCellValue(summary.ProblemName);
                    row.CreateCell(colNumber++).SetCellValue(summary.SubmissionId);
                }
            }

            return outputStream;
        }
    }
}