using OJS.Data.Models.Tests;
using OJS.Services.Common.Data;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Administration.Data
{
    public interface ITestRunsDataService : IDataService<TestRun>
    {
        IQueryable<TestRun> GetAllByTest(int testId);

        void DeleteByProblem(int problemId);

        void DeleteByTest(int testId);

        void DeleteBySubmission(int submissionId);
    }
}