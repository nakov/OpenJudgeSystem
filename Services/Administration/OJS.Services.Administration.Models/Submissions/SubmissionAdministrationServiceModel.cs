using OJS.Services.Common.Models;

namespace OJS.Services.Administration.Models.Submissions;

using System;
using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Administration.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionAdministrationServiceModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public bool IsCompiledSuccessfully { get; set; }

    public bool Processed { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsBinaryFile { get; set; }

    public string? ProcessingComment { get; set; }

    public int Points { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime ModifiedOn { get; set; }

    public DateTime StartedExecutionOn { get; set; }

    public DateTime CompletedExecutionOn { get; set; }

    public string Content { get; set; } = string.Empty;

    public byte[] ByteContent { get; set; } = Array.Empty<byte>();

    public string? FileExtension { get; set; }

    public ParticipantServiceModel Participant { get; set; } = null!;

    public ProblemServiceModel Problem { get; set; } = null!;

    public SubmissionTypesInProblemView SubmissionType { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, SubmissionAdministrationServiceModel>()
            .ForMember(d => d.ByteContent, opt => opt.MapFrom(s =>
                s.Content))
            .ForMember(crm => crm.OperationType, opt
                => opt.Ignore())
            .ForMember(d => d.Content, opt => opt.MapFrom(s =>
                s.IsBinaryFile
                    ? null
                    : s.ContentAsString));
}