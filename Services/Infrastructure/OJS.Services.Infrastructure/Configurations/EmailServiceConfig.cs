namespace OJS.Services.Infrastructure.Configurations;

using System.ComponentModel.DataAnnotations;

public class EmailServiceConfig : BaseConfig
{
    public override string SectionName => "Emails";

    [Required]
    public string ServerHost { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    public int ServerPort { get; set; }

    [Required]
    public string ServerUsername { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string ServerPassword { get; set; } = string.Empty;

    [Required]
    public string SenderEmail { get; set; } = string.Empty;

    [Required]
    public string SenderDisplayValue { get; set; } = string.Empty;

    [Required]
    public string DevEmail { get; set; } = string.Empty;
}