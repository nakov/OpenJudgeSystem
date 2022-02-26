namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class TestsController : BaseAutoCrudAdminController<Test>
{
    private const string ProblemIdKey = nameof(Test.ProblemId);

    public override IActionResult Index()
    {
        if (!this.TryGetEntityIdForColumnFilter(ProblemIdKey, out var problemId))
        {
            return base.Index();
        }

        this.MasterGridFilter = t => t.ProblemId == problemId;
        this.CustomToolbarActions = new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.AddNewTestToProblem),
                RouteValues = new Dictionary<string, string>
                {
                    { nameof(problemId), problemId.ToString() },
                },
            },
        };

        return base.Index();
    }

    public IActionResult AddNewTestToProblem(int problemId)
    {
        this.TempData.Add(ProblemIdKey, problemId);

        return this.RedirectToAction(
            "Create",
            "Tests",
            new Dictionary<string, string> { { ProblemIdKey, problemId.ToString() }, });
    }

    protected override IEnumerable<CustomGridColumn<Test>> CustomColumns
        => new CustomGridColumn<Test>[]
        {
            new()
            {
                Name = AdditionalFormFields.Input.ToString(),
                ValueFunc = t => t.InputDataAsString,
            },
            new()
            {
                Name = AdditionalFormFields.Output.ToString(),
                ValueFunc = t => t.OutputDataAsString,
            },
        };

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Test entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters).ToList();

        var problemId = entityDict.TryGetEntityId<Problem>();

        if (problemId != null)
        {
            var problemInput = formControls.First(fc => fc.Name == nameof(Test.Problem));
            problemInput.Value = problemId;
            problemInput.IsReadOnly = true;
        }

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.Input.ToString(),
            Type = typeof(string),
            Value = entity.InputDataAsString,
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.Output.ToString(),
            Type = typeof(string),
            Value = entity.OutputDataAsString,
        });

        return formControls;
    }

    protected override Task BeforeEntitySaveAsync(Test entity, AdminActionContext actionContext)
    {
        this.UpdateInputAndOutput(entity, actionContext);
        return Task.CompletedTask;
    }

    private void UpdateInputAndOutput(Test entity, AdminActionContext actionContext)
    {
        var inputData = actionContext.GetByteArrayFromStringInput(AdditionalFormFields.Input);
        var outputData = actionContext.GetByteArrayFromStringInput(AdditionalFormFields.Output);

        entity.InputData = inputData;
        entity.OutputData = outputData;
    }
}