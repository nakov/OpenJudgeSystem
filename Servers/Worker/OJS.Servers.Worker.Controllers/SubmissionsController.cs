namespace OJS.Servers.Worker.Controllers;

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Servers.Worker.Models.ExecutionContext;
using OJS.Servers.Worker.Models.ExecutionResult;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SubmissionsController : BaseApiController
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly ILogger<SubmissionsController> logger;

    public SubmissionsController(
        ISubmissionsBusinessService submissionsBusiness,
        ILogger<SubmissionsController> logger)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    [Route("/" + nameof(ExecuteSubmission))]
    public async Task<IActionResult> ExecuteCodeSubmission(
        SubmissionCodeRequestModel submissionCodeRequestModel)
        => await this.ExecuteSubmission(
                submissionCodeRequestModel.Map<SubmissionServiceModel>(),
                submissionCodeRequestModel.WithExceptionStackTrace)
            .ToOkResult();

    [HttpPost]
    [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    [Route("/" + nameof(ExecuteFileSubmission))]
    public async Task<IActionResult> ExecuteFileSubmission(
        [FromForm] SubmissionFileRequestModel submissionFileRequestModel,
        bool keepDetails = false,
        bool escapeTests = true,
        bool keepCheckerFragmentsForCorrectAnswers = true)
        => await this.ExecuteSubmission(
                submissionFileRequestModel.Map<SubmissionServiceModel>(),
                submissionFileRequestModel.WithExceptionStackTrace)
            .ToOkResult();

    [HttpPost]
    [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    public async Task<IActionResult> ExecuteFileSubmissionWithJson(
        [ModelBinder(typeof(JsonWithFilesFormDataModelBinder), Name = "executionContextJson")]
        SubmissionFileRequestModel submissionFileRequestModel)
        => await this.ExecuteSubmission(
                submissionFileRequestModel.Map<SubmissionServiceModel>(),
                submissionFileRequestModel.WithExceptionStackTrace)
            .ToOkResult();

    private async Task<FullExecutionResultResponseModel> ExecuteSubmission(
        SubmissionServiceModel submission,
        bool withStackTrace)
    {
        var result = new FullExecutionResultResponseModel();

        var userId = await this.GetUserId();

        try
        {
            var executionResult = this.submissionsBusiness.ExecuteSubmission(
                submission,
                userId);

            var executionResultResponseModel = executionResult.Map<ExecutionResultResponseModel>();

            result.SetExecutionResult(executionResultResponseModel);
        }
        catch (BusinessServiceException)
        {
            throw;
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Error in executing submission");

            result.SetException(ex, withStackTrace);
        }

        return result;
    }
}

