namespace OJS.Services.Worker.Models.Configuration;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig
{
    [Required]
    public string LoggerFilesFolderPath { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int SubmissionsProcessorIdentifierNumber { get; set; }
}