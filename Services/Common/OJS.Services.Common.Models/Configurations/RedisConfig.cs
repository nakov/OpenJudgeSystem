namespace OJS.Services.Common.Models.Configurations;

using System.ComponentModel.DataAnnotations;

public class RedisConfig
{
    [Required]
    public string ConnectionString { get; set; } = string.Empty;
}