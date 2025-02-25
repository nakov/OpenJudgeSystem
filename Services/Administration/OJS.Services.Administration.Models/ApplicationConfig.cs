namespace OJS.Services.Administration.Models;

public class ApplicationConfig : Infrastructure.Configurations.ApplicationConfig
{
    public string MicrosoftTeamsWebhookUri { get; set; } = string.Empty;

    public int SecondsBetweenContestLimitsAdjustment { get; set; } = 1 * 60;
}