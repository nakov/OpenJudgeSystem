namespace OJS.Services.Ui.Models.Submissions;

using OJS.Workers.Common.Extensions;

public class TestSeparateDetailsServiceModel
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public bool ProblemShowDetailedFeedback { get; set; }

    public string? Input => this.InputData.Decompress();

    public byte[] InputData { get; set; } = [];
}