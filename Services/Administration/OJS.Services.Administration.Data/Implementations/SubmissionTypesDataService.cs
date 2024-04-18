namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class SubmissionTypesDataService : DataService<SubmissionType>, ISubmissionTypesDataService
    {
        public SubmissionTypesDataService(OjsDbContext submissionTypes)
            : base(submissionTypes)
        {
        }

        public IQueryable<SubmissionType> GetAllByProblem(int problemId)
            => this.GetQuery(st => st.SubmissionTypesInProblems
                    .Select(stp => stp.ProblemId)
                    .Contains(problemId));

        public IQueryable<SubmissionType> GetAll() => this.GetQuery();
    }
}