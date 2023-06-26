namespace OJS.Web.Areas.Contests.ViewModels.Results
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Common.Models;
    using OJS.Web.Areas.Contests.ViewModels.Contests;

    using X.PagedList;

    public class ContestResultsViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<ContestProblemListViewModel> Problems { get; set; }

        public IOrderedQueryable<ParticipantResultViewModel> Results { get; set; }

        public IPagedList<ParticipantResultViewModel> PagedResults { get; private set; }

        public bool ContestCanBeCompeted { get; set; }

        public bool ContestCanBePracticed { get; set; }

        public bool UserHasContestRights { get; set; }

        public ContestType ContestType { get; set; }

        public bool IsCompete { get; set; }

        public async Task<ContestResultsViewModel> ToPagedResults(int page, int pageSize)
        {
            this.PagedResults = await this.Results.ToPagedListAsync(page, pageSize);

            return this;
        }
    }
}