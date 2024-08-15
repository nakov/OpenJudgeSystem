namespace OJS.Services.Infrastructure.Configurations;

using System;
using System.ComponentModel.DataAnnotations;
using System.Text;

public class ApplicationConfig : BaseConfig
{
    public override string SectionName => "ApplicationSettings";

    [Required]
    public string SharedAuthCookieDomain { get; set; } = string.Empty;

    [Required]
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the OpenTelemetry protocol collector base URL.
    /// </summary>
    [Required]
    public string OtlpCollectorBaseUrl { get; set; } = string.Empty;

    public string OtlpCollectorUsername { get; set; } = string.Empty;

    public string OtlpCollectorPassword { get; set; } = string.Empty;

    public string OtlpCollectorLogsPushPath { get; set; } = "/v1/logs";

    public string OtlpCollectorLogsPushEndpoint
        => this.OtlpCollectorBaseUrl.EndsWith('/')
            ? $"{this.OtlpCollectorBaseUrl.TrimEnd('/')}{this.OtlpCollectorLogsPushPath}"
            : $"{this.OtlpCollectorBaseUrl}{this.OtlpCollectorLogsPushPath}";

    public string OtlpCollectorBasicAuthHeaderValue
        => $"Basic {Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{this.OtlpCollectorUsername}:{this.OtlpCollectorPassword}"))}";
}