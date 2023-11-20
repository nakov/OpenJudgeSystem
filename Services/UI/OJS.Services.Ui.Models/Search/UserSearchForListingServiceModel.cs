namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using System.Linq;

public class UserSearchForListingServiceModel
{
    public IEnumerable<UserSearchServiceModel> Users { get; set; }
        = Enumerable.Empty<UserSearchServiceModel>();
}