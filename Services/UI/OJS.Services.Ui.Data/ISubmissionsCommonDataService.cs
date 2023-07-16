namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Linq;

    public interface ISubmissionsCommonDataService : IDataService<Submission>
    {
        IQueryable<Submission> GetAllByIdsQuery(IEnumerable<int> ids);
    }
}