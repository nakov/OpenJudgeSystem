namespace OJS.Services.Common.Models.Configurations;

using System.ComponentModel.DataAnnotations;

public class HealthCheckConfig
{
    [Required]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}