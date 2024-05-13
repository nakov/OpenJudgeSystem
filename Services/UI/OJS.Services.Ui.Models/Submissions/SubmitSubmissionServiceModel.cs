namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmitSubmissionServiceModel : IMapExplicitly
{
    public int ProblemId { get; set; }

    public int SubmissionTypeId { get; set; }

    public bool Official { get; set; }

    public byte[]? ByteContent { get; set; }

    public string? StringContent { get; set; }

    public string? FileExtension { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<SubmitSubmissionServiceModel, Submission>()
            .ForMember(
                d => d.Content,
                opt => opt.MapFrom(s =>
                    s.ByteContent == null
                        ? null :
                        s.ByteContent))
            .ForMember(
                d => d.ProblemId,
                opt => opt.MapFrom(s => s.ProblemId))
            .ForMember(
                d => d.SubmissionTypeId,
                opt => opt.MapFrom(s => s.SubmissionTypeId))
            .ForMember(
                d => d.FileExtension,
                opt => opt.MapFrom(s =>
                    s.FileExtension == null
                        ? null
                        : s.FileExtension))
            .ForAllOtherMembers(opt => opt.Ignore());
}