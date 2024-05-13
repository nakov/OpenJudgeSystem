namespace OJS.Services.Administration.Models.ProblemResources;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemResourceDownloadServiceModel : IMapFrom<ProblemResource>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public int ProblemId { get; set; }

    public string ProblemName { get; set; } = string.Empty;
}