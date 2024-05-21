namespace OJS.Services.Ui.Models.Search;

using OJS.Services.Ui.Models.Contests;
using X.PagedList;

public class ContestSearchServiceResultModel
{
    public IPagedList<ContestForListingServiceModel> Contests { get; set; } = null!;

    public int TotalContestsCount { get; set; }
}