namespace OJS.Services.Administration.Business.Tests;

using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Common.Helpers;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Models.Tests;
using OJS.Services.Administration.Business.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

public class TestsBusinessService : AdministrationOperationService<Test, int, TestAdministrationModel>, ITestsBusinessService
{
    private readonly ITestsDataService testsDataService;
    private readonly ITestRunsDataService testRunsDataService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IFileSystemService fileSystemService;
    private readonly IZippedTestsParserService zippedTestsParserService;
    private readonly ISubmissionsDataService submissionsDataService;
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IZipArchivesService zipArchivesService;

    public TestsBusinessService(
        ITestsDataService testsDataService,
        ITestRunsDataService testRunsDataService,
        IProblemsDataService problemsDataService,
        IFileSystemService fileSystemService,
        IZippedTestsParserService zippedTestsParserService,
        ISubmissionsDataService submissionsDataService,
        IProblemsBusinessService problemsBusinessService,
        IZipArchivesService zipArchivesService)
    {
        this.testsDataService = testsDataService;
        this.testRunsDataService = testRunsDataService;
        this.problemsDataService = problemsDataService;
        this.fileSystemService = fileSystemService;
        this.zippedTestsParserService = zippedTestsParserService;
        this.submissionsDataService = submissionsDataService;
        this.problemsBusinessService = problemsBusinessService;
        this.zipArchivesService = zipArchivesService;
    }

    public override async Task<TestAdministrationModel> Get(int id)
    {
        var test = await this.testsDataService.GetByIdQuery(id)
            .Include(t => t.Problem)
            .FirstOrDefaultAsync();

        if (test is null)
        {
            throw new BusinessServiceException($"Test with id: {id} not found.");
        }

        return test.Map<TestAdministrationModel>();
    }

    public async Task DeleteAll(int problemId)
    {
        await this.testRunsDataService.DeleteByProblem(problemId);
        await this.testsDataService.DeleteByProblem(problemId);
    }

    public async Task<string> Import(TestsImportRequestModel model)
    {
        var problem = this.problemsDataService.GetWithTestsSubmissionTypesAndProblemGroupById(model.ProblemId);

        var file = model.Tests;
        var problemId = model.ProblemId;

        if (file == null || file.Length == 0)
        {
            throw new BusinessServiceException(Resources.TestsControllers.NoEmptyFile);
        }

        var extension = this.fileSystemService.GetFileExtension(file);

        if (extension != GlobalConstants.FileExtensions.Zip)
        {
            throw new BusinessServiceException(Resources.TestsControllers.MustBeZip);
        }

        TestsParseResult parsedTests;

        await using (var memory = new MemoryStream())
        {
            await file.CopyToAsync(memory);
            memory.Position = 0;

            try
            {
                parsedTests = await this.zippedTestsParserService.Parse(memory);
            }
            catch
            {
                throw new BusinessServiceException(Resources.TestsControllers.ZipDamaged);
            }
        }

        if (!this.zippedTestsParserService.AreTestsParsedCorrectly(parsedTests))
        {
            throw new BusinessServiceException(Resources.TestsControllers.InvalidTests);
        }

        int addedTestsCount;

        using (var scope = TransactionsHelper.CreateTransactionScope(
                   IsolationLevel.RepeatableRead,
                   TransactionScopeAsyncFlowOption.Enabled))
        {
            this.submissionsDataService.RemoveTestRunsCacheByProblem(problemId);

            if (model.DeleteOldTests)
            {
                await this.testRunsDataService.DeleteByProblem(problemId);
                await this.testsDataService.DeleteByProblem(problemId);
            }

            addedTestsCount = this.zippedTestsParserService.AddTestsToProblem(problem!, parsedTests);

            this.problemsDataService.Update(problem!);
            await this.problemsDataService.SaveChanges();

            if (model.RetestProblem)
            {
                await this.problemsBusinessService.RetestById(problemId);
            }

            scope.Complete();
        }

        return string.Format(Resources.TestsControllers.TestsAddedToProblem, addedTestsCount);
    }

    public async Task<TestsZipExportModel> ExportZip(int problemId)
    {
        var problem = this.problemsDataService.GetWithTestsAndProblemGroupById(problemId);

        var tests = problem!.Tests.OrderBy(x => x.OrderBy);

        var files = new List<InMemoryFile>();

        var trialTestCounter = 1;
        var openTestCounter = 1;
        var testCounter = 1;

        foreach (var test in tests)
        {
            var inputTestName = $"test.{testCounter:D3}{GlobalConstants.TestInputTxtFileExtension}";
            var outputTestName = $"test.{testCounter:D3}{GlobalConstants.TestOutputTxtFileExtension}";

            if (test.IsTrialTest)
            {
                inputTestName = $"test{GlobalConstants.ZeroTestStandardSignature}{trialTestCounter:D3}{GlobalConstants.TestInputTxtFileExtension}";
                outputTestName = $"test{GlobalConstants.ZeroTestStandardSignature}{trialTestCounter:D3}{GlobalConstants.TestOutputTxtFileExtension}";
                trialTestCounter++;
            }
            else if (test.IsOpenTest)
            {
                inputTestName = $"test{GlobalConstants.OpenTestStandardSignature}{openTestCounter:D3}{GlobalConstants.TestInputTxtFileExtension}";
                outputTestName = $"test{GlobalConstants.OpenTestStandardSignature}{openTestCounter:D3}{GlobalConstants.TestOutputTxtFileExtension}";
                openTestCounter++;
            }
            else
            {
                testCounter++;
            }

            files.Add(new InMemoryFile(inputTestName, test.InputDataAsString));
            files.Add(new InMemoryFile(outputTestName, test.OutputDataAsString));
        }

        var zipFile = await this.zipArchivesService.GetZipArchive(files);
        var zipFileName = $"{problem.Name}_Tests_{DateTime.Now}{GlobalConstants.FileExtensions.Zip}";

        return new TestsZipExportModel()
        {
            Content = zipFile, FileName = zipFileName, MimeType = GlobalConstants.MimeTypes.ApplicationZip,
        };
    }
}