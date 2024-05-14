namespace OJS.Services.Administration.Models.ExamGroups;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class ExamGroupAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public int? ContestId { get; set; }

    public string? ContestName { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ExamGroup, ExamGroupAdministrationModel>()
            .ForMember(egam => egam.OperationType, opt
                => opt.Ignore());

        configuration.CreateMap<ExamGroupAdministrationModel, ExamGroup>()
            .ForMember(eg => eg.ExternalAppId, opt => opt.Ignore())
            .ForMember(eg => eg.ExternalExamGroupId, opt => opt.Ignore())
            .ForMember(eg => eg.UsersInExamGroups, opt => opt.Ignore())
            .ForMember(eg => eg.Contest, opt => opt.Ignore());
    }
}