namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestDetailsServiceModel : IMapFrom<Test>
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public byte[] InputData { get; set; } = [];

    public string? InputDataAsString { get; set; }

    public double OrderBy { get; set; }
}