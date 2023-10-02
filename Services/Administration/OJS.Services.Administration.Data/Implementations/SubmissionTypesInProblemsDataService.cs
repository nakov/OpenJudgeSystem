namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Common.Data.Implementations;
using System.Linq;

public class SubmissionTypesInProblemsDataService : DataService<ProblemSubmissionTypeExecutionDetails>, ISubmissionTypesInProblemsDataService
{
    public SubmissionTypesInProblemsDataService(DbContext submissionTypesInProblems)
        : base(submissionTypesInProblems)
    {
    }

    public IQueryable<ProblemSubmissionTypeExecutionDetails> GetAllByProblem(int problemId)
        => this.DbSet
            .Where(pst => pst.ProblemId == problemId);
}