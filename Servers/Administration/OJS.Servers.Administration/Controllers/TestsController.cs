namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions.Strings;
using OJS.Common.Helpers;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Infrastructure.Extensions;
using OJS.Servers.Administration.Models.Tests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Transactions;
using static OJS.Common.GlobalConstants;
using Resource = OJS.Common.Resources.TestsControllers;

public class TestsController : BaseAutoCrudAdminController<Test>
{
    private const string ProblemIdKey = nameof(Test.ProblemId);
    private const int TestInputMaxLengthInGrid = 20;

    private readonly IProblemsDataService problemsData;
    private readonly IZipArchivesService zipArchives;
    private readonly ITestsExportValidationService testsExportValidation;
    private readonly IFileSystemService fileSystem;
    private readonly IZippedTestsParserService zippedTestsParser;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ITestsDataService testsData;
    private readonly ITestRunsDataService testRunsData;
    private readonly IProblemsBusinessService problemsBusiness;

    public TestsController(
        IProblemsDataService problemsData,
        IZipArchivesService zipArchives,
        ITestsExportValidationService testsExportValidation,
        IFileSystemService fileSystem,
        IZippedTestsParserService zippedTestsParser,
        ISubmissionsDataService submissionsData,
        ITestsDataService testsData,
        ITestRunsDataService testRunsData,
        IProblemsBusinessService problemsBusiness)
    {
        this.problemsData = problemsData;
        this.zipArchives = zipArchives;
        this.testsExportValidation = testsExportValidation;
        this.fileSystem = fileSystem;
        this.zippedTestsParser = zippedTestsParser;
        this.submissionsData = submissionsData;
        this.testsData = testsData;
        this.testRunsData = testRunsData;
        this.problemsBusiness = problemsBusiness;
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
                Action = nameof(this.Create),
                RouteValues = routeValues,
            },
            new()
            {
                Name = "Export Zip",
                Action = nameof(this.ExportZip),
                RouteValues = routeValues,
            },
            new()
            {
                Name = "Import tests",
                Action = nameof(this.Import),
                FormControls = this.GetFormControlsForImportTests(problemId),
            },
        };

        return base.Index();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Import(TestsImportRequestModel model)
    {
        var problem = await this.problemsData.OneById(model.ProblemId);

        await this.testsExportValidation
            .GetValidationResult(problem?.Map<ProblemShortDetailsServiceModel>())
            .VerifyResult();

        var file = model.Tests;
        var problemId = model.ProblemId;

        if (file == null || file.Length == 0)
        {
            this.TempData.AddDangerMessage(Resource.No_empty_file);
            return this.RedirectToActionWithNumberFilter(nameof(TestsController), ProblemIdKey, problemId);
        }

        var extension = this.fileSystem.GetFileExtension(file);

        if (extension != FileExtensions.Zip)
        {
            this.TempData.AddDangerMessage(Resource.Must_be_zip);
            return this.RedirectToActionWithNumberFilter(nameof(TestsController), ProblemIdKey, problemId);
        }

        TestsParseResult parsedTests;

        await using (var memory = new MemoryStream())
        {
            await file.CopyToAsync(memory);
            memory.Position = 0;

            try
            {
                parsedTests = await this.zippedTestsParser.Parse(memory);
            }
            catch
            {
                this.TempData.AddDangerMessage(Resource.Zip_damaged);
                return this.RedirectToActionWithNumberFilter(nameof(TestsController), ProblemIdKey, problemId);
            }
        }

        if (!this.zippedTestsParser.AreTestsParsedCorrectly(parsedTests))
        {
            this.TempData.AddDangerMessage(Resource.Invalid_tests);
            return this.RedirectToActionWithNumberFilter(nameof(TestsController), ProblemIdKey, problemId);
        }

        int addedTestsCount;

        using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.RepeatableRead))
        {
            this.submissionsData.RemoveTestRunsCacheByProblem(problemId);

            if (model.DeleteOldTests)
            {
                await this.testRunsData.DeleteByProblem(problemId);
                await this.testsData.DeleteByProblem(problemId);
            }

            addedTestsCount = this.zippedTestsParser.AddTestsToProblem(problem!, parsedTests);

            this.problemsData.Update(problem!);

            if (model.RetestProblem)
            {
                await this.problemsBusiness.RetestById(problemId);
            }

            scope.Complete();
        }

        this.TempData.AddSuccessMessage(string.Format(Resource.Tests_added_to_problem, addedTestsCount));
        return this.RedirectToActionWithNumberFilter(nameof(TestsController), ProblemIdKey, model.ProblemId);
    }

    public async Task<IActionResult> ExportZip(int problemId)
    {
        var problem = await this.problemsData.OneById(problemId);

        await this.testsExportValidation
            .GetValidationResult(problem?.Map<ProblemShortDetailsServiceModel>())
            .VerifyResult();

        var tests = problem!.Tests.OrderBy(x => x.OrderBy);

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
                ValueFunc = t => t.InputDataAsString.ToEllipsis(TestInputMaxLengthInGrid),
            },
            new()
            {
                Name = AdditionalFormFields.Output.ToString(),
                ValueFunc = t => t.OutputDataAsString.ToEllipsis(TestInputMaxLengthInGrid),
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

    private IEnumerable<FormControlViewModel> GetFormControlsForImportTests(int problemId)
        => new FormControlViewModel[]
        {
            new()
            {
                Name = nameof(TestsImportRequestModel.ProblemId),
                Type = typeof(int),
                IsHidden = true,
                Value = problemId,
            },
            new()
            {
                Name = nameof(TestsImportRequestModel.Tests),
                Type = typeof(IFormFile),
            },
            new()
            {
                Name = nameof(TestsImportRequestModel.RetestProblem),
                Type = typeof(bool),
                Value = false,
            },
            new()
            {
                Name = nameof(TestsImportRequestModel.DeleteOldTests),
                Type = typeof(bool),
                Value = true,
            },
        };
}