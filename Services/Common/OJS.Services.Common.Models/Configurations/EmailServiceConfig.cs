namespace OJS.Services.Common.Models.Configurations;

public class EmailServiceConfig
{
    public string ServerHost { get; set; } = string.Empty;

    public int ServerPort { get; set; }

    public string ServerUsername { get; set; } = string.Empty;

    public string ServerPassword { get; set; } = string.Empty;

    public string SenderEmail { get; set; } = string.Empty;

    public string SenderDisplayValue { get; set; } = string.Empty;

    public string DevEmail { get; set; } = string.Empty;
}