namespace OJS.Servers.Ui.Models.Contests;

using System.Collections.Generic;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Services.Ui.Models.Contests;

public class ContestsForHomeIndexResponseModel : IMapFrom<ContestsForHomeIndexServiceModel>
{
    public IEnumerable<ContestForHomeIndexResponseModel> ActiveContests { get; set; }

    public IEnumerable<ContestForHomeIndexResponseModel> PastContests { get; set; }
}