namespace OJS.Services.Administration.Models.LecturerInCategories;

using AutoMapper;
using OJS.Data.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

public class LecturerInCategoryInListModel : IMapExplicitly
{
    public int ContestCategoryId { get; set; }

    public string? ContestCategoryName { get; set; }

    public bool IsDeleted { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<LecturerInContestCategory, LecturerInCategoryInListModel>()
            .ForMember(leincm => leincm.IsDeleted, opt
                => opt.MapFrom(lic => lic.ContestCategory.IsDeleted));
}