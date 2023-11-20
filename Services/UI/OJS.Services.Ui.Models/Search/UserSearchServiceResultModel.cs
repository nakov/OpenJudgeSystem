namespace OJS.Services.Ui.Models.Search;

using X.PagedList;

public class UserSearchServiceResultModel
{
    public IPagedList<UserSearchServiceModel> Users { get; set; } = null!;

    public int TotalUsersCount { get; set; }
}