namespace OJS.Services.Ui.Models.Search;

using System;
using AutoMapper;
using SoftUni.AutoMapper.Infrastructure.Models;
using SoftUni.Common.Models;
public class SearchServiceModel : IMapExplicitly
{
    public string? SearchTerm { get; set; }

    public int PageNumber { get; set; }

    public bool Contests { get; set; }

    public bool Problems { get; set; }

    public bool Users { get; set; }

    public int ItemsPerPage { get; set; }

    public int TotalItemsCount { get; set; }

    public int PagesCount { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<SearchServiceModel, PagedResult<SearchForListingServiceModel>>()
            .ForMember(
                dest => dest.PageNumber,
                opt => opt.MapFrom(
                    src => src.PageNumber))
            .ForMember(
                dest => dest.TotalItemsCount,
                opt => opt.MapFrom(
                    src => src.TotalItemsCount))
            .ForMember(
                dest => dest.ItemsPerPage,
                opt => opt.MapFrom(
                    src => src.ItemsPerPage))
            .ForMember(
                dest => dest.PagesCount,
                opt => opt.MapFrom(
                    src => src.PagesCount))
            .ForMember(
                dest => dest.PagesCount,
                opt => opt.MapFrom(
                    src => src.TotalItemsCount <= src.ItemsPerPage
                        ? 1
                        : (int)Math.Ceiling(src.TotalItemsCount / (double)src.ItemsPerPage)))
            .ForAllOtherMembers(
                dest => dest.Ignore());
}