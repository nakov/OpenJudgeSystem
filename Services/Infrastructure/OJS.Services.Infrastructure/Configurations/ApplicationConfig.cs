namespace OJS.Services.Infrastructure.Configurations;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : BaseConfig
{
    public override string SectionName => "ApplicationSettings";

    [Required]
    public string LoggerFilesFolderPath { get; set; } = string.Empty;

    [Required]
    public string SharedAuthCookieDomain { get; set; } = string.Empty;

    [Required]
    public string ApiKey { get; set; } = string.Empty;

    [Required]
    public string LokiBaseUrl { get; set; } = string.Empty;
}