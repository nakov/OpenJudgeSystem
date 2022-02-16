namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Common.Utils;
using OJS.Data.Models.Problems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

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

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        ProblemGroup entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters).ToList();

        formControls.Add(new FormControlViewModel
        {
            Name = nameof(ProblemGroup.Type),
            Options = EnumUtils.GetValuesFrom<ProblemGroupType>().Cast<object>(),
            Type = typeof(ProblemGroupType),
            Value = entity?.Type ?? default(ProblemGroupType),
        });

        if (action == EntityAction.Edit)
        {
            formControls.First(fc => fc.Name == nameof(ProblemGroup.Contest)).IsReadOnly = true;
        }

        return formControls;
    }
}