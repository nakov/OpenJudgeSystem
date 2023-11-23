namespace OJS.Services.Common.Models.Contests.Results;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class ContestResultsModel : IMapExplicitly
{
    public Contest Contest { get; set; } = new Contest();

    public bool Official { get; set; }

    public bool IsUserAdminOrLecturer { get; set; }

    public bool IsFullResults { get; set; }

    public int? TotalResultsCount { get; set; }

    public bool IsExportResults { get; set; }

    public int Page { get; set; } = 1;

    public int ItemsInPage { get; set; } = int.MaxValue;

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
            .ForMember(d => d.IsUserAdminOrLecturer, opt => opt.Ignore())
            .ForMember(d => d.IsFullResults, opt => opt.Ignore())
            .ForMember(d => d.TotalResultsCount, opt => opt.Ignore())
            .ForMember(d => d.IsExportResults, opt => opt.Ignore())
            .ForMember(d => d.Page, opt => opt.Ignore())
            .ForMember(d => d.ItemsInPage, opt => opt.Ignore())
            // .ForPath(
            // d => d.Contest.ProblemGroups
            //     .SelectMany(pg => pg.Problems)
            //     .AsQueryable()
            //     .Where(p => !p.IsDeleted)
            //     .OrderBy(p => p.OrderBy)
            //     .ThenBy(p => p.Name)
            //     .Select(ContestProblemListViewModel.FromProblem),
            // opt =>
            //     opt.MapFrom(s => s.Problems))
            .ReverseMap();
}