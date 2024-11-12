namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using System.Linq;

    public class SubmissionTypesDataService : AdministrationDataService<SubmissionType>, ISubmissionTypesDataService
    {
        public SubmissionTypesDataService(OjsDbContext submissionTypes)
            : base(submissionTypes)
        {
        }

        public IQueryable<SubmissionType> GetAll() => this.GetQuery();
    }
}