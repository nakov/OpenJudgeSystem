namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Data.Models.Submissions;
    using Microsoft.EntityFrameworkCore;
    using System.Linq;
    using OJS.Services.Common.Data.Implementations;

    public class SubmissionTypesDataService : DataService<SubmissionType>, ISubmissionTypesDataService
    {
        public SubmissionTypesDataService(DbContext submissionTypes) : base(submissionTypes) {}

        public IQueryable<SubmissionType> GetAllByProblem(int problemId)
            => this.DbSet
                .Include(st => st.SubmissionTypesInProblems)
                .Where(st => st.SubmissionTypesInProblems
                    .Select(stp => stp.ProblemId)
                    .Contains(problemId));
    }
}