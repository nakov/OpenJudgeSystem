namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common;
    using OJS.Services.Common.Data.Infrastructure.Implementations;
    using OJS.Services.Infrastructure.Mapping;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ContestsDataService : DataService<Contest>, IContestsDataService
    {
        private readonly IDatesService dates;

        public ContestsDataService(OjsDbContext db, IDatesService dates)
            : base(db)
            => this.dates = dates;

        public async Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>
            => await this.GetAllVisibleQuery()
                .Where(c =>
                    c.StartTime <= this.dates.GetUtcNow() &&
                    c.EndTime.HasValue &&
                    c.EndTime >= this.dates.GetUtcNow())
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public async Task<IEnumerable<TServiceModel>> GetAllPast<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>
            => await this.GetAllVisibleQuery()
                .Where(c => c.EndTime < this.dates.GetUtcNow())
                .MapCollection<TServiceModel>()
                .ToListAsync();

        private IQueryable<Contest> GetAllVisibleQuery()
            => this.DbSet
                .Where(c => c.IsVisible);
    }
}