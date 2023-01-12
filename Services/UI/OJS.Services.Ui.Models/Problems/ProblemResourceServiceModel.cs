namespace OJS.Services.Ui.Models.Problems;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemResourceServiceModel : IMapFrom<ProblemResource>
{
    public int Id { get; set; }

    public int ProblemId { get; set; }

    public string Name { get; set; } = null!;

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }

    public double OrderBy { get; set; }

    public ProblemResourceType Type { get; set; }
}