namespace OJS.Services.Administration.Models.SubmissionTypes;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInDocument : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<SubmissionType, SubmissionTypeInDocument>()
            .ForMember(dest => dest.Id, opt
                => opt.MapFrom(s => s.Id))
            .ForMember(dest => dest.Name, opt
                => opt.MapFrom(s => s.Name));
}