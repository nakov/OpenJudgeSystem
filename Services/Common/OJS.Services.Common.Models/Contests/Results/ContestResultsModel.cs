namespace OJS.Services.Common.Models.Contests.Results;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestResultsModel : IMapExplicitly
{
    public Contest Contest { get; set; } = new Contest();

    public int CategoryId { get; set; }

    public bool Official { get; set; }

    public bool IsUserAdminOrLecturer { get; set; }

    public bool IsFullResults { get; set; }

    public int? TotalResultsCount { get; set; }

    public bool IsExportResults { get; set; }

    public int Page { get; set; } = 1;

    public int ItemsPerPage { get; set; } = int.MaxValue;

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<ContestResultsViewModel, ContestResultsModel>()
            .ForPath(
                d => d.Contest.Name,
                opt => opt.MapFrom(s => s.Name))
            .ForPath(
            d => d.Official,
            opt => opt.MapFrom(s => s.IsCompete))
            .ForPath(
            d => d.Contest.Type,
            opt => opt.MapFrom(s => s.ContestType))
            .ForPath(
                d => d.IsUserAdminOrLecturer,
                opt => opt.MapFrom(s => s.UserHasContestRights))
            .ForMember(d => d.IsFullResults, opt => opt.Ignore())
            .ForMember(d => d.TotalResultsCount, opt => opt.Ignore())
            .ForMember(d => d.IsExportResults, opt => opt.Ignore())
            .ForMember(d => d.Page, opt => opt.Ignore())
            .ForMember(d => d.ItemsPerPage, opt => opt.Ignore())
            .ReverseMap();
}