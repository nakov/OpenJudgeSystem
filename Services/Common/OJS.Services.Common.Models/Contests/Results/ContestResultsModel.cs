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
        .ForMember(
            d => d.Official,
            opt => opt.MapFrom(s => s.IsCompete))
        .ForMember(
            d => d.Contest.Name,
            opt => opt.MapFrom(s => s.Name))
        .ForMember(
            d => d.Contest.Type,
            opt => opt.MapFrom(s => s.ContestType))
        .ForMember(
            d => d.Contest.ProblemGroups
                .SelectMany(pg => pg.Problems)
                .AsQueryable()
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.OrderBy)
                .ThenBy(p => p.Name)
                .Select(ContestProblemListViewModel.FromProblem),
            opt =>
                opt.MapFrom(s => s.Problems))
        .ReverseMap();
}