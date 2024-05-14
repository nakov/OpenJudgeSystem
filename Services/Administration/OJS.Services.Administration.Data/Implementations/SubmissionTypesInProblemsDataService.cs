namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models;
using System.Linq;

public class SubmissionTypesInProblemsDataService : AdministrationDataService<SubmissionTypeInProblem>, ISubmissionTypesInProblemsDataService
{
    public SubmissionTypesInProblemsDataService(OjsDbContext submissionTypesInProblems)
        : base(submissionTypesInProblems)
    {
    }

    public IQueryable<SubmissionTypeInProblem> GetAllByProblem(int problemId)
        => this.GetQuery(stp => stp.ProblemId == problemId);
}