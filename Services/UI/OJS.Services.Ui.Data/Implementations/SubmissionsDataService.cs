namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;

    public class SubmissionsDataService : DataService<Submission>, ISubmissionsDataService
    {
        public SubmissionsDataService(OjsDbContext db) : base(db)
        {
        }
    }
}