namespace OJS.Services.Infrastructure.Configurations;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : BaseConfig
{
    public override string SectionName => "ApplicationSettings";

    /// <summary>
    /// Gets or sets the Elasticsearch node endpoints separated by comma.
    /// </summary>
    [Required]
    public string ElasticsearchEndpoints { get; set; } = string.Empty;

    [Required]
    public string SharedAuthCookieDomain { get; set; } = string.Empty;
}