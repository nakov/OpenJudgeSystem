namespace OJS.Services.Ui.Models.Search;

using OJS.Services.Infrastructure.Models.Mapping;

public class UserSearchResponseModel : IMapFrom<UserSearchServiceModel>
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
}