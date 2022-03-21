namespace OJS.Services.Administration.Models.ProblemResources;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemResourceDownloadServiceModel : IMapFrom<ProblemResource>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public int ProblemId { get; set; }

    public string ProblemName { get; set; } = string.Empty;
}