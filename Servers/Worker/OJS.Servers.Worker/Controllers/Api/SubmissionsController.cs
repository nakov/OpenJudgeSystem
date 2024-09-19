namespace OJS.Servers.Worker.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Worker.Models.ExecutionContext;
using OJS.Servers.Worker.Models.ExecutionResult;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Worker.Business;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;

using static Microsoft.AspNetCore.Http.StatusCodes;

public class SubmissionsController : BaseApiController
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    // private readonly ILogger<SubmissionsController> logger;

    public SubmissionsController(
        ISubmissionsBusinessService submissionsBusiness,
        ILogger<SubmissionsController> logger) =>
        this.submissionsBusiness = submissionsBusiness;

    [HttpPost]
    [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    [Route("/" + nameof(ExecuteSubmission))]
    public async Task<IActionResult> ExecuteCodeSubmission(
        SubmissionCodeRequestModel submissionCodeRequestModel)
        => await this.ExecuteSubmission(
                submissionCodeRequestModel.Map<SubmissionServiceModel>(),
                submissionCodeRequestModel.WithExceptionStackTrace)
            .ToOkResult();

    // Dont think thats used anymore
    // TODO: Remove this method
    [HttpPost]
    [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    [Route("/" + nameof(ExecuteFileSubmission))]
    public async Task<IActionResult> ExecuteFileSubmission(
        [FromForm] SubmissionFileRequestModel submissionFileRequestModel,
        bool keepDetails = false,
        bool escapeTests = true)
        => await this.ExecuteSubmission(
                submissionFileRequestModel.Map<SubmissionServiceModel>(),
                submissionFileRequestModel.WithExceptionStackTrace)
            .ToOkResult();

    // Dont think thats used anymore
    // [HttpPost]
    // [ProducesResponseType(typeof(FullExecutionResultResponseModel), Status200OK)]
    // public async Task<IActionResult> ExecuteFileSubmissionWithJson(
    //     [ModelBinder(typeof(JsonWithFilesFormDataModelBinder), Name = "executionContextJson")]
    //     SubmissionFileRequestModel submissionFileRequestModel)
    //     => await this.ExecuteSubmission(
    //             submissionFileRequestModel.Map<SubmissionServiceModel>(),
    //             submissionFileRequestModel.WithExceptionStackTrace)
    //         .ToOkResult();

    private async Task<FullExecutionResultResponseModel> ExecuteSubmission(
        SubmissionServiceModel submission,
        bool withStackTrace)
    {
        var result = new FullExecutionResultResponseModel();
        var startedExecutionTime = DateTime.UtcNow;
        try
        {
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);

            var executionResultResponseModel = executionResult.Map<ExecutionResultResponseModel>();

            result.SetExecutionResult(executionResultResponseModel);
        }
        catch (BusinessServiceException ex)
        {
            result.SetException(ex, false);
        }
        catch (Exception ex)
        {
            result.SetException(ex, withStackTrace);
        }
        finally
        {
            result.SetStartedAndCompletedExecutionOn(startedExecutionTime, completedExecutionOn: DateTime.UtcNow);
        }

        return await Task.FromResult(result);
    }
}