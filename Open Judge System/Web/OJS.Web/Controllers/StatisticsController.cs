namespace OJS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Web.Mvc;

    using OJS.Data;
    using OJS.Services.Cache.Statistics;
    using OJS.Web.ViewModels.Statistics;

    public class StatisticsController : BaseController
    {
        private readonly ISubmissionStatisticsCacheService submissionStatisticsCache;

        public StatisticsController(IOjsData data, ISubmissionStatisticsCacheService submissionStatisticsCache)
            : base(data)
        {
            this.submissionStatisticsCache = submissionStatisticsCache;
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
    }
}