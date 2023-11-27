namespace OJS.Services.Common.Models.Configurations;

public class HttpConfig : BaseConfig
{
    public override string SectionName => "Http";

    public int MaxRequestSizeLimit { get; set; }

    public string AllowedHosts { get; set; } = string.Empty;
}