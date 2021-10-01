namespace OJS.Services.Cache.Statistics
{
    using OJS.Data.Models;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.Cache;
    using OJS.Services.Data.Submissions;

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using static OJS.Common.Constants.CacheConstants;

    public class SubmissionStatisticsCacheService : ISubmissionStatisticsCacheService
    {
        private readonly ICacheService cache;
        private readonly ISubmissionsDataService submissionsData;

        public SubmissionStatisticsCacheService(
            ICacheService cache,
            ISubmissionsDataService submissionsData)
        {
            this.cache = cache;
            this.submissionsData = submissionsData;
        }

        public IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubsmissionsCountByMonthForPastYear()
        {
            var currentDate = DateTime.UtcNow;
            var elevenMonthsSubmissionsResult = this.GetSubsmissionsCountByMonthForPastYearExceptLastMonth(currentDate);
            var lastMonthSubmissionsResult = this.GetSubsmissionsCountByMonthForLastMonth(currentDate);

            var lastMonthNumber = elevenMonthsSubmissionsResult.Last().MonthNumber;
            var currentMonthNumber = lastMonthSubmissionsResult.Single().MonthNumber;

            if (lastMonthNumber == currentMonthNumber)
            {
                // Next month has just started before the cache for last month is expired
                this.cache.Remove(SubmissionsCountForLastMonthKey);
                lastMonthSubmissionsResult = this.GetSubsmissionsCountByMonthForLastMonth(currentDate);
            };

            var result = elevenMonthsSubmissionsResult.Concat(lastMonthSubmissionsResult);

            return result;
        }

        private IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubsmissionsCountByMonthForPastYearExceptLastMonth(
            DateTime currentDate)
            => this.cache.Get(
                SubmissionsCountByMonthsForPastElevenMonthsKey,
                () => this.GetSubmissionsCountGroupsForPastYearExceptLastMonth(currentDate),
                this.GetAbsoluteEndOfMonth(currentDate));

        private IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubsmissionsCountByMonthForLastMonth(DateTime currentDate)
            => this.cache.Get(
                SubmissionsCountForLastMonthKey,
                () => this.GetSubmissionsCountGroupForLastMonth(currentDate),
                OneHourInSeconds);

        private List<SubmissionCountByMonthStatisticsModel> GetSubmissionsCountGroupsByMonths(
            Expression<Func<Submission, bool>> filter,
            bool orderGroups,
            int defaultMonthIfEmpty)
        {
            var groups = this.submissionsData
                .GetAll()
                .Where(filter)
                .GroupBy(s => new { s.CreatedOn.Year, s.CreatedOn.Month });

            if (orderGroups)
            {
                groups = groups.OrderBy(g => g.Min(s => s.CreatedOn));
            }

            return groups
                .Select(g => new SubmissionCountByMonthStatisticsModel
                {
                    MonthNumber = g.Key.Month,
                    TotalSubmissionsCount = g.Count(),
                })
                .AsEnumerable()
                .DefaultIfEmpty(new SubmissionCountByMonthStatisticsModel
                {
                    MonthNumber = defaultMonthIfEmpty,
                    TotalSubmissionsCount = 0,
                })
                .ToList();
        }

        private IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubmissionsCountGroupsForPastYearExceptLastMonth(
            DateTime currentDate)
        {
            var begginingOfYearSet = this.GetAbsoluteBeggingOfMonth(currentDate.AddMonths(-11));
            var begginingOfCurrentMont = this.GetAbsoluteBeggingOfMonth(currentDate);

            return this.GetSubmissionsCountGroupsByMonths(
                s => s.CreatedOn >= begginingOfYearSet && s.CreatedOn < begginingOfCurrentMont,
                orderGroups: true,
                defaultMonthIfEmpty: begginingOfYearSet.Month);
        }

        private IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubmissionsCountGroupForLastMonth(
            DateTime currentDate)
        {
            var begginingOfCurrentMont = this.GetAbsoluteBeggingOfMonth(currentDate);
            var endOfCurrentMonth = this.GetAbsoluteEndOfMonth(currentDate);

            return this.GetSubmissionsCountGroupsByMonths(
                s => s.CreatedOn >= begginingOfCurrentMont && s.CreatedOn <= endOfCurrentMonth,
                orderGroups: false,
                defaultMonthIfEmpty: begginingOfCurrentMont.Month);
        }

        private DateTime GetAbsoluteBeggingOfMonth(DateTime date)
            => new DateTime(date.Year, date.Month, 1).Date;

        private DateTime GetAbsoluteEndOfMonth(DateTime date)
            => new DateTime(
                date.Year,
                date.Month,
                DateTime.DaysInMonth(date.Year, date.Month))
            .AddDays(1)
            .AddTicks(-1);
    }
}
