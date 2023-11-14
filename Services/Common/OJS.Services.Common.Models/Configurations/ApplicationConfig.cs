namespace OJS.Services.Common.Models.Configurations;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig
{
    [Required]
    public string LoggerFilesFolderPath { get; set; } = string.Empty;

    [Required]
    public string SharedAuthCookieDomain { get; set; } = string.Empty;

    [Required]
    public string UiUrl { get; set; } = string.Empty;

    [Required]
    public string SulsPlatformBaseUrl { get; set; } = string.Empty;

    [Required]
    public string SulsPlatformApiKey { get; set; } = string.Empty;
}