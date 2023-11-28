namespace OJS.Services.Common.Models.Configurations;

public class HttpConfig : BaseConfig
{
    public override string SectionName => "Http";

    public int MaxRequestSizeLimit { get; set; } = 35000000;
}