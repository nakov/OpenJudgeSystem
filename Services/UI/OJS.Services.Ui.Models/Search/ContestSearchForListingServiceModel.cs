namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using System.Linq;

public class ContestSearchForListingServiceModel
{
    public IEnumerable<ContestSearchServiceModel> Contests { get; set; }
        = Enumerable.Empty<ContestSearchServiceModel>();
}