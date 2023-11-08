namespace OJS.Services.Ui.Models.Search;

using SoftUni.AutoMapper.Infrastructure.Models;

public class UserSearchResponseModel : IMapFrom<UserSearchServiceModel>
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
}