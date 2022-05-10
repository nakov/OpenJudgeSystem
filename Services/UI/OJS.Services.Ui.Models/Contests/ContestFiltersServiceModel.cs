namespace OJS.Services.Ui.Models.Contests;

using SoftUni.Judge.Common.Enumerations;
using System.Collections.Generic;
using System.Linq;

public class ContestFiltersServiceModel
{
    public int? CategoryId { get; set; }

    public IEnumerable<ContestStatus> Statuses { get; set; } = Enumerable.Empty<ContestStatus>();

    public IEnumerable<ExecutionStrategyType> ExecutionStrategyTypes { get; set; } =
        Enumerable.Empty<ExecutionStrategyType>();
}