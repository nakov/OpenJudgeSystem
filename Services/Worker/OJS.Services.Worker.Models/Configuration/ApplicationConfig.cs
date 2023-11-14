namespace OJS.Services.Worker.Models.Configuration;

using System.ComponentModel.DataAnnotations;

public class ApplicationConfig
{
    [Range(1, int.MaxValue)]
    public int SubmissionsProcessorIdentifierNumber { get; set; }
}