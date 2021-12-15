namespace OJS.Servers.Ui.Models.Contests
{
    using System.Collections.Generic;
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class ContestsForHomeIndexResponseModel : IMapFrom<ContestsForHomeIndexServiceModel>
    {
        public IEnumerable<ContestForHomeIndexResponseModel> ActiveContests { get; set; }

        public IEnumerable<ContestForHomeIndexResponseModel> PastContests { get; set; }
    }
}