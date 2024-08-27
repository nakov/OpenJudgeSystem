namespace OJS.Services.Worker.Business.ExecutionContext.Implementations;

using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Common;
using OJS.Workers.Common;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using static OJS.Services.Worker.Business.ExecutionContext.ExecutionContextConstants;
using static OJS.Services.Worker.Business.Validation.ValidationConstants;

public class ExecutionContextBuilderService : IExecutionContextBuilderService
{
    private readonly IExecutionContextValuesProviderService executionContextValuesProvider;
    private readonly ICodeTemplatesProviderService codeTemplatesProvider;
    private readonly INotDefaultValueValidationService notDefaultValueValidationService;

    public ExecutionContextBuilderService(
        IExecutionContextValuesProviderService executionContextValuesProvider,
        ICodeTemplatesProviderService codeTemplatesProvider,
        INotDefaultValueValidationService notDefaultValueValidationService)
    {
        this.executionContextValuesProvider = executionContextValuesProvider;
        this.codeTemplatesProvider = codeTemplatesProvider;
        this.notDefaultValueValidationService = notDefaultValueValidationService;
    }

    public string BuildCodeFromTemplate(SubmissionServiceModel submissionServiceModel)
    {
        var template = this.codeTemplatesProvider.GetDefaultCodeTemplate(submissionServiceModel.ExecutionStrategy);

        this.notDefaultValueValidationService
            .GetValidationResult(
                template,
                null!,
                string.Format(null, CodeTemplateNotFoundTemplate, submissionServiceModel.ExecutionStrategy))
            .VerifyResult();

        return template.Replace(TemplatePlaceholders.CodePlaceholder, submissionServiceModel.Code);
    }

    public OjsSubmission<TInput> BuildOjsSubmission<TInput>(SubmissionServiceModel submissionServiceModel)
    {
        var submission = submissionServiceModel.Map<OjsSubmission<TInput>>();

        this.notDefaultValueValidationService
            .GetValidationResult(
                submission.Input,
                nameof(submission.Input),
                string.Format(null, CannotCreateInputTemplate, submissionServiceModel.ExecutionType))
            .VerifyResult();

        submission.AdditionalCompilerArguments = this.executionContextValuesProvider
            .GetDefaultAdditionalCompilerArgumentsByCompilerType(submission.CompilerType);

        submission.TimeLimit = submission.TimeLimit == default
            ? this.executionContextValuesProvider
                .GetDefaultTimeLimitByExecutionStrategyType(submission.ExecutionStrategyType)
            : submission.TimeLimit;

        submission.MemoryLimit = submission.MemoryLimit == default
            ? this.executionContextValuesProvider
                .GetDefaultMemoryLimitByExecutionStrategyType(submission.ExecutionStrategyType)
            : submission.MemoryLimit;

        submission.AllowedFileExtensions = submissionServiceModel.FileContent?.Length > 0
            ? DefaultAllowedFileExtension
            : default!;

        return submission;
    }
}