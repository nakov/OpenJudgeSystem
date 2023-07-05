﻿namespace OJS.Services.Worker.Business.Implementations;

using System;
using System.Collections.Generic;
using System.Linq;
using OJS.Workers.Common;
using OJS.Workers.ExecutionStrategies.Models;
using OJS.Services.Worker.Business.Validation;
using OJS.Services.Worker.Models.Configuration;
using OJS.Services.Worker.Models.ExecutionContext;
using FluentExtensions.Extensions;
using OJS.Services.Worker.Models.ExecutionResult;
using OJS.Services.Worker.Models.ExecutionResult.Output;
using OJS.Workers.ExecutionStrategies.Extensions;
using AutoMapper;
using Microsoft.Extensions.Options;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Worker.Business.ExecutionContext;
using OJS.Services.Worker.Business.Extensions;
using OJS.Services.Infrastructure;
using static OJS.Services.Common.ServiceConstants.CodeExecutionContext;

public class SubmissionsBusinessService : ISubmissionsBusinessService
{
    private readonly IRandomProvider random;
    private readonly IExecutionContextBuilderService executionContextBuilder;
    private readonly ISubmissionsValidationService submissionsValidation;
    private readonly ISubmissionExecutor submissionExecutor;
    private readonly IMapper mapper;
    private readonly SubmissionExecutionConfig executionConfig;

    public SubmissionsBusinessService(
        IRandomProvider random,
        IOptions<SubmissionExecutionConfig> submissionExecutionConfigAccessor,
        IExecutionContextBuilderService executionContextBuilder,
        ISubmissionsValidationService submissionsValidation,
        ISubmissionExecutor submissionExecutor,
        IMapper mapper)
    {
        this.executionConfig = submissionExecutionConfigAccessor.Value;
        this.random = random;
        this.executionContextBuilder = executionContextBuilder;
        this.submissionsValidation = submissionsValidation;
        this.submissionExecutor = submissionExecutor;
        this.mapper = mapper;
    }

    public ExecutionResultServiceModel ExecuteSubmission(
        SubmissionServiceModel submission,
        string userId)
    {
        this.submissionsValidation
            .GetValidationResult(submission)
            .VerifyResult();

        switch (submission.ExecutionType)
        {
            case ExecutionType.SimpleExecution:
            case ExecutionType.SimpleTemplateExecution:
                return this.InternalExecuteSubmission<SimpleInputModel, OutputResult>(
                    submission,
                    userId);

            case ExecutionType.TestsExecution:
            case ExecutionType.TestsTemplateExecution:
                return this.InternalExecuteSubmission<TestsInputModel, TestResult>(
                    submission,
                    userId);

            default:
                throw new ArgumentException("Submission execution type not valid");
        }
    }

    private static void PreprocessLineEndings(SubmissionServiceModel submission)
    {
        if (submission.TestsExecutionDetails != null && submission.ExecutionOptions!.EscapeLineEndings)
        {
            submission.TestsExecutionDetails.Tests = submission.TestsExecutionDetails.Tests
                .Mutate(x => x.Input = x.Input
                    .Replace("\r\n", "\n")
                    .Replace("\\r\\n", "\\n"))
                .ToList();
        }
    }

    // This method fills in the user output fragment on correct answers,
    // as the OJS worker does not return output on correct answers
    // this method can be safely discarded after https://github.com/SoftUni-Internal/suls-issues/issues/5811
    // has been closed.
    private static void FillForCorrectAnswers(IList<TestResult> testResults, IList<TestContext> testContexts)
    {
        if (testContexts.Count != testResults.Count)
        {
            return;
        }

        testResults.ForEach((index, testResult) =>
        {
            var isResultCorrectAnswerAndTrialTest =
                testResult.ResultType ==
                OJS.Workers.Common.Models.TestRunResultType.CorrectAnswer;

            if (isResultCorrectAnswerAndTrialTest)
            {
                var output = testContexts[index].Output;

                testResult.CheckerDetails =
                    new CheckerDetails
                    {
                        UserOutputFragment = output,
                        ExpectedOutputFragment = output,
                    };
            }
        });
    }

    // This is done to assure no information can be extracted from the networks tab when returning hidden tests in the response
    private static void RemoveDetailsForHiddenTests(TaskResultServiceModel taskResult)
        => Enumerable.Where<TestResult>(taskResult.TestResults, t => !t.IsTrialTest)
            .ForEach(t => t.CheckerDetails = new CheckerDetails());

    private ExecutionResultServiceModel InternalExecuteSubmission<TInput, TResult>(
        SubmissionServiceModel submission,
        string userId)
        where TResult : ISingleCodeRunResult, new()
    {
        this.PreprocessSubmission(submission);
        PreprocessLineEndings(submission);

        var ojsSubmission = this.executionContextBuilder.BuildOjsSubmission<TInput>(submission);

        var ojsWorkerExecutionResult = this.submissionExecutor.Execute<TInput, TResult>(ojsSubmission);

        var executionResult = this.mapper.Map<ExecutionResultServiceModel>(ojsWorkerExecutionResult);
        executionResult.StartedExecutionOn = ojsSubmission.StartedExecutionOn;

        var taskMaxPoints = submission.TestsExecutionDetails?.MaxPoints ?? TaskDefaultMaxPoints;

        if (executionResult.TaskResult == null)
        {
            this.ProcessSimpleExecutionResult(executionResult);
        }
        else
        {
            this.ProcessTaskResult(submission, executionResult, taskMaxPoints, userId);
        }

        return executionResult;
    }

    private void PreprocessSubmission(SubmissionServiceModel submission)
    {
        switch (submission.ExecutionType)
        {
            case ExecutionType.SimpleTemplateExecution:
            case ExecutionType.TestsTemplateExecution:
                submission.Code = this.executionContextBuilder.BuildCodeFromTemplate(submission);
                break;
        }

        if (submission.TestsExecutionDetails != null && submission.ExecutionOptions!.EscapeTests)
        {
            submission.TestsExecutionDetails.Tests = submission.TestsExecutionDetails.Tests
                .Mutate(x => x.Input = x.Input
                    .Replace("\\[", "[")
                    .Replace("\\]", "]")
                    .Replace("\\<", "<")
                    .Replace("\\>", ">")
                    .Replace("\\{", "{")
                    .Replace("\\}", "}")
                    .Replace("\\\\$", "$")
                    .Replace("\\$", "$")
                    .Replace("\\`", "`")
                    .Replace("\\#", "#")
                    .Replace("\\|", "|"))
                .ToList();
        }
    }

    private void ProcessSimpleExecutionResult(ExecutionResultServiceModel executionResult)
        => executionResult.OutputResult
            ?.LimitLength(this.executionConfig.OutputResultMaxLength);

    private void ProcessTaskResult(
        SubmissionServiceModel submission,
        ExecutionResultServiceModel executionResult,
        int taskMaxPoints,
        string userId)
    {
        executionResult.Id = this.BuildUniqueId(submission.TestsExecutionDetails!.TaskId!);

        if (submission.ExecutionOptions!.KeepCheckerFragmentsForCorrectAnswers)
        {
            FillForCorrectAnswers(
                Enumerable.ToList<TestResult>(executionResult.TaskResult!.TestResults),
                Enumerable.ToList<TestContext>(submission.TestsExecutionDetails.Tests));
        }

        executionResult.TaskResult!.CalculatePoints(taskMaxPoints);

        if (!submission.ExecutionOptions.KeepDetails)
        {
            RemoveDetailsForHiddenTests(executionResult.TaskResult!);
        }
    }

    private string BuildUniqueId(string prefix)
        => $"{prefix}_{this.random.GetRandomString()}";
}