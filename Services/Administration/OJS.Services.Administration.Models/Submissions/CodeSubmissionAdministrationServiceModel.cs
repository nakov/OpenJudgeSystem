namespace OJS.Services.Administration.Models.Submissions;

using System;
using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class CodeSubmissionAdministrationServiceModel : SubmissionAdministrationServiceModel
{
    public byte[] Content { get; set; } = Array.Empty<byte>();

    public string? FileExtension { get; set; }

    public string ContentAsString { get; set; } = string.Empty;
}