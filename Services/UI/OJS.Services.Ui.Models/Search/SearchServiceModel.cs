namespace OJS.Services.Ui.Models.Search;

using System;
using AutoMapper;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Infrastructure.Models;

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
    {
        configuration.CreateMap<SearchServiceModel, PagedResult<ContestSearchServiceModel>>()
            .ForAllMembers(opts => ConfigurePagedResultCommon(opts));

        configuration.CreateMap<SearchServiceModel, PagedResult<ProblemSearchServiceModel>>()
            .ForAllMembers(opts => ConfigurePagedResultCommon(opts));

        configuration.CreateMap<SearchServiceModel, PagedResult<UserSearchServiceModel>>()
            .ForAllMembers(opts => ConfigurePagedResultCommon(opts));
    }

    private static void ConfigurePagedResultCommon<T>(IMemberConfigurationExpression<SearchServiceModel, PagedResult<T>, object> opts)
    {
        switch (opts.DestinationMember.Name)
        {
            case "PageNumber":
                opts.MapFrom(src => src.PageNumber);
                break;
            case "TotalItemsCount":
                opts.MapFrom(src => src.TotalItemsCount);
                break;
            case "ItemsPerPage":
                opts.MapFrom(src => src.ItemsPerPage);
                break;
            case "PagesCount":
                opts.MapFrom(src => src.TotalItemsCount <= src.ItemsPerPage
                    ? 1
                    : (int)Math.Ceiling(src.TotalItemsCount / (double)src.ItemsPerPage));
                break;
            default:
                opts.Ignore();
                break;
        }
    }
}