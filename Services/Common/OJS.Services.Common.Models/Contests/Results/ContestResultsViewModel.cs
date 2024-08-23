namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Common.Enumerations;
using System.Collections.Generic;
using System.Linq;
using X.PagedList;

public class ContestResultsViewModel
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? CategoryId { get; set; }

    public IEnumerable<ContestProblemListViewModel> Problems { get; set; } = Enumerable.Empty<ContestProblemListViewModel>();

    public IEnumerable<ParticipantResultViewModel> Results { get; set; } = Enumerable.Empty<ParticipantResultViewModel>();

    public IPagedList<ParticipantResultViewModel>? PagedResults { get; private set; }

    public bool ContestCanBeCompeted { get; set; }

    public bool ContestCanBePracticed { get; set; }

    public bool UserIsInRoleForContest { get; set; }

    public ContestType ContestType { get; set; }

    public bool IsCompete { get; set; }

    public bool UserHasContestRights { get; set; }

    public int ItemsPerPage { get; set; }

    public int PagesCount { get; set; }

    public ContestResultsViewModel ToPagedResults(int page, int pageSize)
    {
        this.PagedResults = this.Results.ToPagedList(page, pageSize);

        return this;
    }
}