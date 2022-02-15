namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using System.Collections.Generic;
using System.Linq;

public class ProblemGroupsController : BaseAutoCrudAdminController<ProblemGroup>
{
    public IActionResult Problems([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(ProblemsController),
            nameof(OJS.Data.Models.Problems.Problem.ProblemGroupId),
            int.Parse(complexId.Values.First()));

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new() { Action = nameof(this.Problems) },
        };
}