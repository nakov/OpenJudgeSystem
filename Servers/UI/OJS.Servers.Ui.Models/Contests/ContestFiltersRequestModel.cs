namespace OJS.Servers.Ui.Models.Contests;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using SoftUni.Judge.Common.Enumerations;
using System.Collections.Generic;

public class ContestFiltersRequestModel : IMapTo<ContestFiltersServiceModel>
{
    public int? CategoryId { get; set; }

    [BindProperty(Name = "status")]
    public IEnumerable<ContestStatus>? Statuses { get; set; }

    [BindProperty(Name = "strategy")]
    public IEnumerable<ExecutionStrategyType>? ExecutionStrategyTypes { get; set; }
}