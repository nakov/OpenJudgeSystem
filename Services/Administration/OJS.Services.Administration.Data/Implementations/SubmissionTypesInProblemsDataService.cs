namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Common.Data.Implementations;
using System.Linq;

public class SubmissionTypesInProblemsDataService : DataService<SubmissionTypeInProblem>, ISubmissionTypesInProblemsDataService
{
    public SubmissionTypesInProblemsDataService(DbContext submissionTypesInProblems)
        : base(submissionTypesInProblems)
    {
    }

    public IQueryable<SubmissionTypeInProblem> GetAllByProblem(int problemId)
        => this.DbSet
            .Where(stp => stp.ProblemId == problemId);
}