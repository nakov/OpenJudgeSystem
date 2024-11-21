namespace OJS.Services.Infrastructure.Configurations;

using System.ComponentModel.DataAnnotations;

public class MentorConfig : BaseConfig
{
    public override string SectionName => "Mentor";

    [Required]
    public string ApiKey { get; set; } = default!;
}