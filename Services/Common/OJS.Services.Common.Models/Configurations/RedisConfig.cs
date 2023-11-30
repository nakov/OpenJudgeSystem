namespace OJS.Services.Common.Models.Configurations;

using System.ComponentModel.DataAnnotations;

public class RedisConfig : BaseConfig
{
    public override string SectionName => "Redis";

    [Required]
    public string ConnectionString { get; set; } = string.Empty;
}