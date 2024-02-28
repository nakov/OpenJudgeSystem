﻿namespace OJS.Services.Administration.Models.ProblemResources;

using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemResourceInListModel : IMapFrom<ProblemResource>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ProblemResourceType Type { get; set; }

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }

    public double OrderBy { get; set; }

    public bool IsDeleted { get; set; }
}