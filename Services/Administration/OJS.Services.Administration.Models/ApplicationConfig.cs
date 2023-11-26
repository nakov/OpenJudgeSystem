namespace OJS.Services.Administration.Models;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : Common.Models.Configurations.ApplicationConfig
{
    [Required]
    public string LocalTimeZone { get; set; } = string.Empty;
}