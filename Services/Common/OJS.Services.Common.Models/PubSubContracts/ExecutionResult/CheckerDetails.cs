namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class CheckerDetails
{
    public string? Comment { get; set; }

    public string? ExpectedOutputFragment { get; set; }

    public string? UserOutputFragment { get; set; }
}