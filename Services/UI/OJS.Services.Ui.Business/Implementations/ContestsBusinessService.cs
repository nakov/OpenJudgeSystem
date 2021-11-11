namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Common.Extensions;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Contests;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class ContestsBusinessService : IContestsBusinessService
    {
        private const int DefaultPastContestsToTake = 15;

        private readonly IContestsDataService contestsData;

        public ContestsBusinessService(IContestsDataService contestsData)
            => this.contestsData = contestsData;

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable()
            => await this.contestsData
                .GetAllCompetable<ContestForHomeIndexServiceModel>()
                .OrderByAsync(ac => ac.EndTime);

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPast()
            => await this.contestsData
                .GetAllPast<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(pc => pc.EndTime)
                .TakeAsync(DefaultPastContestsToTake);
    }
}