namespace OJS.Services.Administration.Models.TestRuns;

using OJS.Data.Models.Tests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class TestRunsInListModel : IMapFrom<TestRun>
{
    public int Id { get; set; }

    public int TimeUsed { get; set; }

    public long MemoryUsed { get; set; }

    public string? ExecutionComment { get; set; }

    public string? CheckerComment { get; set; }

    public int SubmissionId { get; set; }

    public string? ResultType { get; set; }
}