namespace OJS.Services.Administration.Models.TestRuns;

using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestRunInListModel : IMapFrom<TestRun>
{
    public int Id { get; set; }

    public int TimeUsed { get; set; }

    public long MemoryUsed { get; set; }

    public string? ExecutionComment { get; set; }

    public string? CheckerComment { get; set; }

    public int SubmissionId { get; set; }

    public int ResultType { get; set; }
}