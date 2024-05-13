namespace OJS.Services.Ui.Models;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : Infrastructure.Configurations.ApplicationConfig
{
    [Required]
    public string UiHomeYouTubeVideoId { get; set; } = string.Empty;
}