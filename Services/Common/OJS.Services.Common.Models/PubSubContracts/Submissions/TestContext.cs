namespace OJS.Services.Common.Models.PubSubContracts.Submissions;

public class TestContext
{
    public int Id { get; set; }

    public string? Input { get; set; }

    public string? Output { get; set; }

    public bool IsTrialTest { get; set; }

    public double OrderBy { get; set; }
}