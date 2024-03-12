namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class SubmissionTypesDataService : DataService<SubmissionType>, ISubmissionTypesDataService
    {
        public SubmissionTypesDataService(DbContext db)
            : base(db)
        {
        }

        public IQueryable<SubmissionType> GetAllByProblem(int problemId)
            => this.GetQuery()
                .Where(st => st.SubmissionTypesInProblems
                    .Any(p => p.ProblemId == problemId));
    }
}