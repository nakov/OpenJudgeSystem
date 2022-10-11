using Microsoft.AspNetCore.Mvc;

namespace OJS.Servers.Ui.Models.Contests;

public class ContestSortingRequestModel
{
    [BindProperty(Name = "sorttype")]
    public string? SortType { get; set; }
}