using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class TaskResult
{
    public int Points { get; set; }

    public IEnumerable<TestResult> TestResults { get; set; } = Enumerable.Empty<TestResult>();
}