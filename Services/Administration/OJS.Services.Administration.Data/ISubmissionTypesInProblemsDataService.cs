namespace OJS.Services.Administration.Data;

using OJS.Data.Models;
using OJS.Services.Common.Data;
using SoftUni.Services.Infrastructure;
using System.Linq;

public interface ISubmissionTypesInProblemsDataService : IService, IDataService<ProblemSubmissionTypeExecutionDetails>
{
    IQueryable<ProblemSubmissionTypeExecutionDetails> GetAllByProblem(int problemId);
}