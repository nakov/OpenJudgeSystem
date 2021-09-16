namespace OJS.Services.Cache.Statistics
{
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common;

    using System.Collections.Generic;

    public interface ISubmissionStatisticsCacheService : IService
    {
        IEnumerable<SubmissionCountByMonthStatisticsModel> GetSubsmissionsCountByMonthForPastYear();
    }
}
