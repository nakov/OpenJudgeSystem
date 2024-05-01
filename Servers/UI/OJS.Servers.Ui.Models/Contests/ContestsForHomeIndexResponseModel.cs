namespace OJS.Servers.Ui.Models.Contests;

using System.Collections.Generic;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Ui.Models.Contests;

public class ContestsForHomeIndexResponseModel : IMapFrom<ContestsForHomeIndexServiceModel>
{
    public IEnumerable<ContestForHomeIndexResponseModel> ActiveContests { get; set; } = null!;

    public IEnumerable<ContestForHomeIndexResponseModel> PastContests { get; set; } = null!;
}