namespace OJS.Services.Common.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using System.Collections.Generic;
    using System.Linq;

    public class SubmissionsCommonDataService : DataService<Submission>, ISubmissionsCommonDataService
    {
        public SubmissionsCommonDataService(OjsDbContext db) : base(db)
        {
        }

        public IQueryable<Submission> GetAllByIdsQuery(IEnumerable<int> ids)
            => this.GetQuery()
                .Where(s => ids.Contains(s.Id));
    }
}