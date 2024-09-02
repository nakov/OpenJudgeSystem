namespace OJS.Servers.Ui.Models.Search;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Models.Search;
using OJS.Services.Infrastructure.Models.Mapping;

public class SearchRequestModel : IMapTo<SearchServiceModel>
{
    public string? SearchTerm { get; set; }

    [BindProperty(Name = "page")]
    public int PageNumber { get; set; }

    public bool Contests { get; set; }

    public bool Problems { get; set; }

    public bool Users { get; set; }

    public int? ItemsPerPage { get; set; }

    public int TotalItemsCount { get; set; }

    public int PagesCount { get; set; }
}