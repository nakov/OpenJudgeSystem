namespace OJS.Services.Infrastructure.Configurations;

using System.ComponentModel.DataAnnotations;

public class HealthCheckConfig : BaseConfig
{
    public override string SectionName => "HealthCheck";

    [Required]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}