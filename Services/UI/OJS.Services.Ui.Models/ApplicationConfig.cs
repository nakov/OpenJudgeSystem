namespace OJS.Services.Ui.Models;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : Common.Models.Configurations.ApplicationConfig
{
    [Required]
    public string UiHomeYouTubeVideoId { get; set; } = string.Empty;
}