namespace OJS.Services.Common.Data
{
    using OJS.Data.Models.Submissions;
    using System.Collections.Generic;
    using System.Linq;

    public interface ISubmissionsCommonDataService : IDataService<Submission>
    {
        IQueryable<Submission> GetAllByIdsQuery(IEnumerable<int> ids);
    }
}