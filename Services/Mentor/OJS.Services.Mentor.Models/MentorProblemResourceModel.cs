namespace OJS.Services.Mentor.Models;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class MentorProblemResourceModel : IMapFrom<ProblemResource>
{
    public int ProblemId { get; set; }

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }
}