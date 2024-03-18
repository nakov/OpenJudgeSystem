namespace OJS.Services.Administration.Models.Checkers;

using AutoMapper;
using OJS.Data.Models.Checkers;
using SoftUni.AutoMapper.Infrastructure.Models;

public class CheckerAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? DllFile { get; set; }

    public string? ClassName { get; set; }

    public string? Parameter { get; set; }
    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<Checker, CheckerAdministrationModel>();

        configuration.CreateMap<CheckerAdministrationModel, Checker>()
            .ForMember(c => c.IsDeleted, opt
                => opt.Ignore())
            .ForMember(c => c.DeletedOn, opt
                => opt.Ignore())
            .ForMember(c => c.CreatedOn, opt
                => opt.Ignore())
            .ForMember(c => c.ModifiedOn, opt
                => opt.Ignore());
    }
}