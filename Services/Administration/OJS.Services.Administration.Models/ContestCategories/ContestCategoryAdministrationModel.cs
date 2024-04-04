using OJS.Services.Common.Models;

namespace OJS.Services.Administration.Models.ContestCategories;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class ContestCategoryAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public double OrderBy { get; set; }

    public int? ParentId { get; set; }

    public string? Parent { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsVisible { get; set; }

    public DateTime? DeletedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? CreatedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ContestCategoryAdministrationModel, ContestCategory>()
            .ForMember(c => c.Parent, opt
                => opt.Ignore())
            .ForMember(c => c.LecturersInContestCategories, opt
                => opt.Ignore())
            .ForMember(c => c.Children, opt
                => opt.Ignore())
            .ForMember(c => c.Contests, opt
                => opt.Ignore());

        configuration.CreateMap<ContestCategory, ContestCategoryAdministrationModel>()
            .ForMember(dest => dest.Parent, opt
                => opt.MapFrom(src => src.Parent!.Name))
            .ForMember(c => c.ModifiedOn, opt
                => opt.Ignore())
            .ForMember(dest => dest.OperationType, opt
                => opt.Ignore());
    }
}