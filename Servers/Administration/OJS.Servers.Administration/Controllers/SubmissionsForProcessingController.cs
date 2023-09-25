namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using System.Collections.Generic;
using System.Linq;
using OJS.Data.Models.Submissions;
using System;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class SubmissionsForProcessing : BaseAutoCrudAdminController<SubmissionForProcessing>
{
    protected override IEnumerable<GridAction> CustomActions
        => new[] { new GridAction { Action = nameof(this.Details) } };

    protected override IEnumerable<GridAction> DefaultActions
        => Enumerable.Empty<GridAction>();

    public Task<IActionResult> Details([FromQuery] IDictionary<string, string> complexId)
        => this.Edit(complexId, string.Empty);

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        SubmissionForProcessing entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType).ToList();

        if (action == EntityAction.Edit)
        {
            formControls.ForEach(fc =>
            {
                if (fc.Name is nameof(SubmissionForProcessing.Processed) or nameof(SubmissionForProcessing.Processing))
                {
                    fc.IsHidden = true;
                }
                else
                {
                    fc.IsReadOnly = true;
                }
            });
        }

        return formControls;
    }
}