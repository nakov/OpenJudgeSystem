namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models.Checkers;
using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public class CheckersController : BaseAutoCrudAdminController<Checker>
{
    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Checker entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType)
            .ToList();

        var parameterFormControl = formControls.First(x => x.Name == nameof(entity.Parameter));

        parameterFormControl.FormControlType = FormControlType.TextArea;

        return formControls;
    }
}