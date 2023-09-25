namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using System.Collections.Generic;
using System.Linq;
using OJS.Data.Models.Submissions;
using System;
using System.Linq.Expressions;

public class SubmissionsForProcessing : BaseAutoCrudAdminController<SubmissionForProcessing>
{
    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Edit) } };

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
            formControls.ForEach(fc => fc.IsReadOnly = true);
        }

        return formControls;
    }
}