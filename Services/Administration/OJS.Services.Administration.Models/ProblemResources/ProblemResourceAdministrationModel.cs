﻿namespace OJS.Services.Administration.Models.ProblemResources;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemResourceAdministrationModel : BaseAdministrationModel<int>, IMapFrom<ProblemResource>
{
    public string Name { get; set; } = string.Empty;

    public string? Type { get; set; }

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }

    public double OrderBy { get; set; }
}