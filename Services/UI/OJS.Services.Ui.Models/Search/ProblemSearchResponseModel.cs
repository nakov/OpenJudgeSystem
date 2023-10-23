namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class ProblemSearchResponseModel : IMapFrom<ProblemSearchForListingServiceModel>
{
    public IEnumerable<ProblemSearchServiceModel> Problems { get; set; }
        = Enumerable.Empty<ProblemSearchServiceModel>();
}