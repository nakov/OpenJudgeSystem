namespace OJS.Services.Administration.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Administration.Models.SubmissionTypes;

public class SubmissionAdministrationServiceModel : IMapFrom<Submission>
{
    public int Id { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public bool Processed { get; set; }

    public bool IsDeleted { get; set; }

    public string? ProcessingComment { get; set; }

    public int Points { get; set; }

    public ParticipantServiceModel Participant { get; set; } = null!;

    public ProblemServiceModel Problem { get; set; } = null!;

    public SubmissionTypesInProblemView SubmissionType { get; set; } = null!;
}