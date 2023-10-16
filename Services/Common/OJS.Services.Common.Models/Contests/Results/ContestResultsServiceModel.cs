namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Common.Enumerations;
using System.Collections.Generic;
using System.Linq;
using X.PagedList;

public class ContestResultsServiceModel
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public IEnumerable<ContestProblemListServiceModel> Problems { get; set; } = Enumerable.Empty<ContestProblemListServiceModel>();

    public IEnumerable<ParticipantResultServiceModel> Results { get; set; } = Enumerable.Empty<ParticipantResultServiceModel>();

    public IPagedList<ParticipantResultServiceModel>? PagedResults { get; private set; }

    public bool ContestCanBeCompeted { get; set; }

    public bool ContestCanBePracticed { get; set; }

    public bool UserHasContestRights { get; set; }

    public ContestType ContestType { get; set; }

    public bool IsCompete { get; set; }

    public ContestResultsServiceModel ToPagedResults(int page, int pageSize)
    {
        this.PagedResults = this.Results.ToPagedList(page, pageSize);

        return this;
    }
}