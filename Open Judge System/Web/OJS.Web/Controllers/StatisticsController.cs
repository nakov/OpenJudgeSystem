namespace OJS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Web.Mvc;
    using MissingFeatures;
    using OJS.Common;
    using OJS.Common.Models;
    using OJS.Data;
    using OJS.Services.Business.ParticipantScores;
    using OJS.Services.Cache.Statistics;
    using OJS.Web.Common.Attributes;
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

        [HttpGet]
        [AuthorizeRoles(SystemRole.Administrator)]
        public ActionResult GetContestCategoryContestsParticipantScoreInfo(int id, bool showHidden = true, bool official = true)
        {
            var categoryParticipationSummary = this.participantScoresBusiness.GetCategoryParticipationSummary(id, showHidden, official);

            var excel = new CategoryContestsParticipationSummaryExcel(categoryParticipationSummary);
            
            return this.File(
                excel.GetAsStream().ToArray(),
                GlobalConstants.ExcelMimeType,
                $"Summary_{id}.xls");
        }
    }
}