namespace OJS.Data.Repositories.Contracts
{
    using System.Linq;

    using OJS.Data.Contracts;
    using OJS.Data.Models;

    public interface IContestInstancesRepository : IDeletableEntityRepository<ContestInstance>
    {
        IQueryable<ContestInstance> AllActive();

        IQueryable<ContestInstance> AllFuture();

        IQueryable<ContestInstance> AllPast();

        IQueryable<ContestInstance> AllVisible();

        IQueryable<ContestInstance> AllVisibleInCategory(int categoryId);
    }
}
