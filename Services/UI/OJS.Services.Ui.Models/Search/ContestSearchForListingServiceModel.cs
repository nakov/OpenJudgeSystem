namespace OJS.Services.Ui.Models.Search;

using OJS.Services.Ui.Models.Contests;
using System.Collections.Generic;
using System.Linq;

public class ContestSearchForListingServiceModel
{
    public IEnumerable<ContestForListingServiceModel> Contests { get; set; }
        = Enumerable.Empty<ContestForListingServiceModel>();
}