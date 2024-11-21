namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure.Extensions;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ContestCategoriesDataService : DataService<ContestCategory>, IContestCategoriesDataService
    {
        public ContestCategoriesDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<ContestCategory> GetAllVisible()
            => this.GetQuery(cc => cc.IsVisible);

        public Task<IEnumerable<T>> GetAllVisible<T>()
            => this.GetQuery(cc => cc.IsVisible)
                .MapCollection<T>()
                .ToEnumerableAsync();

        public async Task<IEnumerable<T>> GetAllowedStrategyTypesByIds<T>(IEnumerable<int> ids)
            => await this.GetQuery(cc => ids.Contains(cc.Id))
                .SelectMany(c => c.Contests)
                    .Where(c => !c.IsDeleted && c.IsVisible)
                .SelectMany(pg => pg.ProblemGroups)
                    .Where(pg => !pg.IsDeleted)
                .SelectMany(p => p.Problems)
                    .Where(p => !p.IsDeleted)
                .SelectMany(stp => stp.SubmissionTypesInProblems)
                .Select(st => st.SubmissionType)
                .Distinct()
                .MapCollection<T>()
                .ToListAsync();

        public IQueryable<ContestCategory> GetAllVisibleOrdered() =>
            this.GetQuery(cc => cc.IsVisible)
                .OrderBy(x => x.OrderBy);

        public Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>()
            => this.GetAllVisibleOrdered()
                .Where(x => !x.ParentId.HasValue)
                .MapCollection<TServiceModel>()
                .ToEnumerableAsync();
    }
}