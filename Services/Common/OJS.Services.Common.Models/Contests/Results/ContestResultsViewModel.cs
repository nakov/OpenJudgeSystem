namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Common.Enumerations;
using OJS.Services.Infrastructure.Models;
using System.Collections.Generic;

public class ContestResultsViewModel
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? CategoryId { get; set; }

    public IEnumerable<ContestProblemListViewModel> Problems { get; set; } = [];

    public PagedResult<ParticipantResultViewModel> PagedResults { get; set; } = new();

    public bool ContestCanBeCompeted { get; set; }

    public bool ContestCanBePracticed { get; set; }

    public bool UserIsInRoleForContest { get; set; }

    public ContestType ContestType { get; set; }

    public bool IsCompete { get; set; }

    public bool UserHasContestRights { get; set; }
}