namespace OJS.Data.Repositories
{
    using System;
    using System.Linq;

    using OJS.Data.Models;
    using OJS.Data.Repositories.Base;
    using OJS.Data.Repositories.Contracts;

    public class ContestInstancesRepository : DeletableEntityRepository<ContestInstance>, IContestInstancesRepository
    {
        public ContestInstancesRepository(IOjsDbContext context)
            : base(context)
        {
        }

        public IQueryable<ContestInstance> AllActive()
        {
            return
                this.All()
                    .Where(x => x.StartTime <= DateTime.Now && DateTime.Now <= x.EndTime && x.IsVisible);
        }

        public IQueryable<ContestInstance> AllFuture()
        {
            return this.All().Where(x => x.StartTime > DateTime.Now && x.IsVisible);
        }

        public IQueryable<ContestInstance> AllPast()
        {
            return this.All().Where(x => x.EndTime < DateTime.Now && x.IsVisible);
        }

        public IQueryable<ContestInstance> AllVisible()
        {
            return this.All()
                .Where(x => x.IsVisible);
        }

        public IQueryable<ContestInstance> AllVisibleInCategory(int categoryId)
        {
            return this.All()
                .Where(x => x.IsVisible && x.CategoryId == categoryId);
        }
    }
}
