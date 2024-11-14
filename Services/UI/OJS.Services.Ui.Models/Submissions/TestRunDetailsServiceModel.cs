namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Workers.Common.Models;

public class TestRunDetailsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public int TimeUsed { get; set; }

    public long MemoryUsed { get; set; }

    public int SubmissionId { get; set; }

    public string? ExecutionComment { get; set; }

    public string? CheckerComment { get; set; }

    public TestRunResultType ResultType { get; set; }

    public string? ExpectedOutputFragment { get; set; }

    public string? UserOutputFragment { get; set; }

    public bool IsTrialTest => this.Test.IsTrialTest;

    public string? Input { get; set; }

    public double OrderBy => this.Test.OrderBy;

    public bool ShowInput { get; set; } = true;

    public int TestId { get; set; }

    public TestDetailsServiceModel Test { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<TestRun, TestRunDetailsServiceModel>()
            .ForMember(d => d.Input, opt => opt.Ignore())
            .ForMember(d => d.IsTrialTest, opt => opt.Ignore())
            .ForMember(d => d.OrderBy, opt => opt.Ignore())
            .ForMember(d => d.ShowInput, opt => opt.Ignore());
}