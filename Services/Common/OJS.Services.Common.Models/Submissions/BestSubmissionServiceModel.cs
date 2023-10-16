namespace OJS.Services.Common.Models.Submissions;

using OJS.Services.Common.Models.Contests.Results;
using System.Collections.Generic;

public class BestSubmissionServiceModel
{
    public int? Id { get; set; }

    public int Points { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public string? SubmissionType { get; set; }

    public string? TestRunsCache { get; set; }

    public IEnumerable<TestRunFullResultsServiceModel> TestRuns =>
        TestRunFullResultsServiceModel.FromCache(this.TestRunsCache);
}