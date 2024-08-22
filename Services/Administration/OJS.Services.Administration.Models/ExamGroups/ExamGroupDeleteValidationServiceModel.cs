namespace OJS.Services.Administration.Models.ExamGroups;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ExamGroupDeleteValidationServiceModel : IMapExplicitly
{
    public bool ContestIsActive { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ExamGroup, ExamGroupDeleteValidationServiceModel>()
            .ForMember(d => d.ContestIsActive, opt => opt.Ignore());
}