namespace OJS.Services.Administration.Models;

public class ApplicationConfig : Infrastructure.Configurations.ApplicationConfig
{
    public string MicrosoftTeamsWebhookUri { get; set; } = string.Empty;

    public int SecondsBetweenContestLimitsAdjustment { get; set; } = 3 * 60;

    // Alpha for the exponential moving average of the busy ratio.
    // Formula for alpha is 2 / (N + 1), where N is the number of samples in the moving average.
    // For N = 10, alpha = 0.1818.
    public double BusyRatioMonitorAlpha { get; set; } = 0.06;

    public int SecondsBetweenWorkersBusyRatioPolling { get; set; } = 10;
}