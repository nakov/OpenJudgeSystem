namespace OJS.Services.Administration.Models;

public class ApplicationConfig : Infrastructure.Configurations.ApplicationConfig
{
    public string MicrosoftTeamsWebhookUri { get; set; } = string.Empty;
}