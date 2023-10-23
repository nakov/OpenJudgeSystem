namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class ContestSearchResponseModel : IMapFrom<ContestSearchForListingServiceModel>
{
    public IEnumerable<ContestSearchServiceModel> Contests { get; set; }
        = Enumerable.Empty<ContestSearchServiceModel>();
}