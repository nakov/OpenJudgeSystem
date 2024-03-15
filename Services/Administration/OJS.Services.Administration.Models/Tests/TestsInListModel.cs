namespace OJS.Services.Administration.Models.Tests;

using OJS.Data.Models.Tests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class TestsInListModel : IMapFrom<Test>
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public double OrderBy { get; set; }

    public int ProblemId { get; set; }

    public string? ProblemName { get; set; }
}