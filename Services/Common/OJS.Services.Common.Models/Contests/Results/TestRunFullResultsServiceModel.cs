namespace OJS.Services.Common.Models.Contests.Results;

using System.Collections.Generic;
using System.Linq;
using OJS.Workers.Common.Models;

public class TestRunFullResultsServiceModel
{
    public bool IsZeroTest { get; set; }

    public TestRunResultType ResultType { get; set; }

    public static IEnumerable<TestRunFullResultsServiceModel> FromCache(string? testRunsCache)
    {
        if (string.IsNullOrWhiteSpace(testRunsCache))
        {
            return Enumerable.Empty<TestRunFullResultsServiceModel>();
        }

        var trialTestsCount = testRunsCache.First() - '0';

        var trialTests = testRunsCache
            .Skip(1)
            .Take(trialTestsCount)
            .Select(s => new TestRunFullResultsServiceModel
            {
                IsZeroTest = true,
                ResultType = (TestRunResultType)(s - '0'),
            });

        var tests = testRunsCache
            .Skip(1 + trialTestsCount)
            .Select(s => new TestRunFullResultsServiceModel
            {
                IsZeroTest = false,
                ResultType = (TestRunResultType)(s - '0'),
            });

        var result = new List<TestRunFullResultsServiceModel>();

        result.AddRange(trialTests);
        result.AddRange(tests);

        return result;
    }
}