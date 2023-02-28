namespace OJS.Servers.Ui.Models.Search;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Models.Search;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SearchRequestModel : IMapTo<SearchServiceModel>
{
    public string? SearchTerm { get; set; } = null!;

    [BindProperty(Name = "page")]
    public int? PageNumber { get; set; }

    public SearchSelectType SelectedTerm { get; set; }

    public int? ItemsPerPage { get; set; }

    public int TotalItemsCount { get; set; }

    public int PagesCount { get; set; }
}