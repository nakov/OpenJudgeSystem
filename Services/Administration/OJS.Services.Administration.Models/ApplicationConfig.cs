namespace OJS.Services.Administration.Models;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : Infrastructure.Configurations.ApplicationConfig
{
    [Required]
    public string LocalTimeZone { get; set; } = string.Empty;
}