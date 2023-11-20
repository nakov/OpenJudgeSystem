namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using System.Linq;

public class ProblemSearchForListingServiceModel
{
    public IEnumerable<ProblemSearchServiceModel> Problems { get; set; }
        = Enumerable.Empty<ProblemSearchServiceModel>();
}