namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models;
using OJS.Services.Common.Data.Implementations;
using System.Linq;

public class SubmissionTypesInProblemsDataService : DataService<SubmissionTypeInProblem>, ISubmissionTypesInProblemsDataService
{
    public SubmissionTypesInProblemsDataService(OjsDbContext submissionTypesInProblems)
        : base(submissionTypesInProblems)
    {
    }

    public IQueryable<SubmissionTypeInProblem> GetAllByProblem(int problemId)
        => this.DbSet
            .Where(stp => stp.ProblemId == problemId);
}