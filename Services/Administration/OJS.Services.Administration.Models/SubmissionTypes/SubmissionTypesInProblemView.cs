namespace OJS.Services.Administration.Models.SubmissionTypes;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;
public class SubmissionTypesInProblemView : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<SubmissionType, SubmissionTypesInProblemView>()
            .ForMember(pam => pam.Id, opt
                => opt.MapFrom(p => p.Id))
            .ForMember(pam => pam.Name, opt
                => opt.MapFrom(p => p.Name));
}