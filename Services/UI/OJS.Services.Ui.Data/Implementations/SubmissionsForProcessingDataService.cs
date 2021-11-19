namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;

    public class SubmissionsForProcessingDataService
        : DataService<SubmissionForProcessing>,
        ISubmissionsForProcessingDataService
    {
        public SubmissionsForProcessingDataService(OjsDbContext db) : base(db)
        {
        }
    }
}