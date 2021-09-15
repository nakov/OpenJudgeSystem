namespace OJS.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Web.Mvc;

    using OJS.Data;
    using OJS.Services.Business.Submissions;
    using OJS.Web.ViewModels.Statistics;

    public class StatisticsController : BaseController
    {
        private readonly ISubmissionsBusinessService submissionsBusiness;

        public StatisticsController(IOjsData data, ISubmissionsBusinessService submissionsBusiness)
            : base(data)
        {
            this.submissionsBusiness = submissionsBusiness;
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

            this.submissionsBusiness
                .GetSubmissionsCountByMonthForLast12Months()
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