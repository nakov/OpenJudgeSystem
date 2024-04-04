using OJS.Services.Common.Models;

namespace OJS.Services.Administration.Models.ProblemGroups;

using AutoMapper;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Contests.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using SoftUni.AutoMapper.Infrastructure.Extensions;

public class ProblemGroupsAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public double OrderBy { get; set; }

    public string? Type { get; set; }

    public ContestCopyProblemsValidationServiceModel Contest { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ProblemGroup, ProblemGroupsAdministrationModel>()
            .ForMember(pgam => pgam.OperationType, opt
                => opt.Ignore())
            .ForMember(pgam => pgam.Contest, opt
                => opt.MapFrom(pg => pg.Contest.Map<ContestCopyProblemsValidationServiceModel>()));

        configuration.CreateMap<ProblemGroupsAdministrationModel, ProblemGroup>()
            .ForMember(pg => pg.ContestId, opt
                => opt.MapFrom(pgam => pgam.Contest.Id))
            .ForMember(pg => pg.DeletedOn, opt
                => opt.Ignore())
            .ForMember(pg => pg.CreatedOn, opt
                => opt.Ignore())
            .ForMember(pg => pg.ModifiedOn, opt
                => opt.Ignore())
            .ForMember(pg => pg.Problems, opt
                => opt.Ignore())
            .ForMember(pg => pg.IsDeleted, opt
            => opt.Ignore())
            .ForMember(pg => pg.Contest, opt
                => opt.Ignore());
    }
}