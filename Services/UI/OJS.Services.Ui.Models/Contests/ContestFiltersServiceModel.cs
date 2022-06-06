namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using System.Collections.Generic;
using System.Linq;

public class ContestFiltersServiceModel
{
    public int? CategoryId { get; set; }

    [IgnoreMap]
    public IEnumerable<int> CategoryIds { get; set; } = Enumerable.Empty<int>();

    public IEnumerable<ContestStatus> Statuses { get; set; } = Enumerable.Empty<ContestStatus>();

    public IEnumerable<int> SubmissionTypeIds { get; set; } =
        Enumerable.Empty<int>();

    public int? PageNumber { get; set; }

    public int? ItemsPerPage { get; set; }
}