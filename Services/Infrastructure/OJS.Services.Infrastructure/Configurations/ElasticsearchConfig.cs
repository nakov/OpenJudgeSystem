namespace OJS.Services.Infrastructure.Configurations;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

public class ElasticsearchConfig : BaseConfig
{
    public override string SectionName => "Elasticsearch";

    /// <summary>
    /// Gets or sets the Elasticsearch node endpoints separated by comma.
    /// </summary>
    [Required]
    public string Endpoints { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string CertificateFingerprint { get; set; } = string.Empty;

    public ICollection<Uri> GetEndpoints()
    {
        var endpoints = this.Endpoints.Split(',', StringSplitOptions.RemoveEmptyEntries);
        return endpoints.Select(endpoint => new Uri(endpoint)).ToArray();
    }
}