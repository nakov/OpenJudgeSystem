using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Common.Models.PubSubContracts.Submissions;

public class TestsExecutionDetails
{
    public byte[]? SolutionSkeleton { get; set; }

    public int? MaxPoints { get; set; }

    public string? CheckerTypeName { get; set; }

    public string? CheckerParameter { get; set; }

    public IEnumerable<TestContext> Tests { get; set; } = Enumerable.Empty<TestContext>();
}