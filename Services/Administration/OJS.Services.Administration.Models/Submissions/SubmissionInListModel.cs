namespace OJS.Services.Administration.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionInListModel : IMapExplicitly
{
    public int Id { get; set; }

    public int ParticipantId { get; set; }

    public string? ParticipantName { get; set; }

    public string? ProblemName { get; set; }

    public int ProblemId { get; set; }

    public string? SubmissionTypeName { get; set; }

    public string? ContestName { get; set; }

    public string? ContestId { get; set; }

    public bool Processed { get; set; }

    public int Points { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsBinaryFile { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, SubmissionInListModel>()
        .ForMember(x => x.ContestId, opt
            => opt.MapFrom(x => x.Problem.ProblemGroup.ContestId))
        .ForMember(x => x.IsBinaryFile, opt
            => opt.MapFrom(x => !string.IsNullOrEmpty(x.FileExtension)))
                .ForMember(x => x.ContestName, opt
            => opt.MapFrom(x => x.Problem.ProblemGroup.Contest.Name))
        .ForMember(x => x.ParticipantName, opt
    => opt.MapFrom(x => x.Participant!.User.UserName));
}