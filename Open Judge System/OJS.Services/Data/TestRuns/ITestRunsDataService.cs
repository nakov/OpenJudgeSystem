﻿namespace OJS.Services.Data.TestRuns
{
    using OJS.Services.Common;

    public interface ITestRunsDataService : IService
    {
        void DeleteByProblem(int problemId);

        void DeleteByContest(int contestId);
    }
}