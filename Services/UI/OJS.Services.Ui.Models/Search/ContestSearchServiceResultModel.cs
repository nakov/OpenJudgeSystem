namespace OJS.Services.Ui.Models.Search;

using X.PagedList;

public class ContestSearchServiceResultModel
{
    public IPagedList<ContestSearchServiceModel> Contests { get; set; } = null!;

    public int TotalContestsCount { get; set; }
}