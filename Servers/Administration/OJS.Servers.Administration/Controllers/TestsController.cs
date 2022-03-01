namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants;

public class TestsController : BaseAutoCrudAdminController<Test>
{
    private readonly IProblemsDataService problemsData;
    private readonly IZipArchivesService zipArchives;
    private const string ProblemIdKey = nameof(Test.ProblemId);

    public TestsController(
        IProblemsDataService problemsData,
        IZipArchivesService zipArchives)
    {
        this.problemsData = problemsData;
        this.zipArchives = zipArchives;
    }

    public override IActionResult Index()
    {
        if (!this.TryGetEntityIdForColumnFilter(ProblemIdKey, out var problemId))
        {
            return base.Index();
        }

        var routeValues = new Dictionary<string, string>
        {
            { nameof(problemId), problemId.ToString() },
        };

        this.MasterGridFilter = t => t.ProblemId == problemId;
        this.CustomToolbarActions = new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.AddNewTestToProblem),
                RouteValues = routeValues,
            },
            new()
            {
                Name = "Export Zip",
                Action = nameof(this.ExportZip),
                RouteValues = routeValues,
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

    public async Task<IActionResult> ExportZip(int problemId)
    {
        var problem = await this.problemsData.OneById(problemId);

        if (problem == null)
        {
            throw new BusinessServiceException($"Invalid problem with id: {problemId}");
        }

        // TODO: validate user has problem permissions
        // if (!this.CheckIfUserHasProblemPermissions(id))
        // {
        //     this.TempData.AddDangerMessage(GeneralResource.No_privileges_message);
        //     return this.Json("No premissions");
        // }

        var tests = problem.Tests.OrderBy(x => x.OrderBy);

        var files = new List<InMemoryFile>();

        var trialTestCounter = 1;
        var openTestCounter = 1;
        var testCounter = 1;

        foreach (var test in tests)
        {
            var inputTestName = $"test.{testCounter:D3}{TestInputTxtFileExtension}";
            var outputTestName = $"test.{testCounter:D3}{TestOutputTxtFileExtension}";

            if (test.IsTrialTest)
            {
                inputTestName = $"test{ZeroTestStandardSignature}{trialTestCounter:D3}{TestInputTxtFileExtension}";
                outputTestName = $"test{ZeroTestStandardSignature}{trialTestCounter:D3}{TestOutputTxtFileExtension}";
                trialTestCounter++;
            }
            else if (test.IsOpenTest)
            {
                inputTestName = $"test{OpenTestStandardSignature}{openTestCounter:D3}{TestInputTxtFileExtension}";
                outputTestName = $"test{OpenTestStandardSignature}{openTestCounter:D3}{TestOutputTxtFileExtension}";
                openTestCounter++;
            }
            else
            {
                testCounter++;
            }

            files.Add(new InMemoryFile(inputTestName, test.InputDataAsString));
            files.Add(new InMemoryFile(outputTestName, test.OutputDataAsString));
        }

        var zipFile = await this.zipArchives.GetZipArchive(files);
        var zipFileName = $"{problem.Name}_Tests_{DateTime.Now}{FileExtensions.Zip}";

        return this.File(zipFile, MimeTypes.ApplicationZip, zipFileName);
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