namespace OJS.Services.Ui.Models.Submissions;

using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Ui.Models.Cache;
using OJS.Workers.Common.Extensions;

public class TestDetailsServiceModel : IMapFrom<TestCacheModel>
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public byte[] InputData { get; set; } = [];

    public string InputDataAsString => this.InputData.Decompress();

    public double OrderBy { get; set; }
}