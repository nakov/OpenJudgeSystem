namespace OJS.Services.Worker.Models.Configuration;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig : Common.Models.Configurations.ApplicationConfig
{
    [Range(1, int.MaxValue)]
    public int SubmissionsProcessorIdentifierNumber { get; set; }
}