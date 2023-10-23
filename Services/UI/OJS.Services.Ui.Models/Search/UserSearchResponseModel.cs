namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class UserSearchResponseModel : IMapFrom<UserSearchForListingServiceModel>
{
     public IEnumerable<UserSearchServiceModel> Users { get; set; }
            = Enumerable.Empty<UserSearchServiceModel>();
}