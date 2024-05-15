namespace OJS.Services.Common.Implementations;

using Microsoft.Extensions.Logging;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsCommonBusinessService : ISubmissionsCommonBusinessService
{
    private readonly ISubmissionPublisherService submissionPublisherService;
    private readonly ISubmissionsCommonDataService submissionsCommonDataService;
    private readonly ISubmissionsForProcessingCommonDataService submissionForProcessingData;
    private readonly ILogger<SubmissionsCommonBusinessService> logger;

    public SubmissionsCommonBusinessService(
        ISubmissionPublisherService submissionPublisherService,
        ISubmissionsCommonDataService submissionsCommonDataService,
        ISubmissionsForProcessingCommonDataService submissionForProcessingData,
        ILogger<SubmissionsCommonBusinessService> logger)
    {
        this.submissionPublisherService = submissionPublisherService;
        this.submissionsCommonDataService = submissionsCommonDataService;
        this.submissionForProcessingData = submissionForProcessingData;
        this.logger = logger;
    }

    public SubmissionServiceModel BuildSubmissionForProcessing(
        Submission submission,
        Problem problem,
        SubmissionType submissionType)
        {
            // We detach the existing entity, in order to avoid tracking exception on Update.
            this.submissionsCommonDataService.Detach(submission);

            // Needed to map execution details
            submission.Problem = problem;
            submission.SubmissionType = submissionType;

            var serviceModel = submission.Map<SubmissionServiceModel>();

            serviceModel.TestsExecutionDetails!.TaskSkeleton = problem.SubmissionTypesInProblems
                .Where(x => x.SubmissionTypeId == submission.SubmissionTypeId)
                .Select(x => x.SolutionSkeleton)
                .FirstOrDefault();

            return serviceModel;
        }

    public SubmissionServiceModel BuildSubmissionForProcessing(Submission submission)
        => this.BuildSubmissionForProcessing(submission, submission.Problem, submission.SubmissionType!);

    public async Task PublishSubmissionForProcessing(SubmissionServiceModel submission)
    {
        try
        {
            await this.submissionPublisherService.Publish(submission);

            await this.submissionForProcessingData.MarkProcessing(submission.Id);
        }
        catch (Exception ex)
        {
            this.logger.LogError($"Exception in submitting solution {submission.Id} by {Environment.NewLine}{ex.Message}{Environment.NewLine}{ex.InnerException}");
            throw;
        }
    }

    public async Task PublishSubmissionsForProcessing(IEnumerable<SubmissionServiceModel> submissions)
    {
        try
        {
            await this.submissionPublisherService.PublishMultiple(submissions);

            var submissionsIds = submissions.Select(s => s.Id).ToList();

            await this.submissionForProcessingData.MarkMultipleForProcessing(submissionsIds);
        }
        catch (Exception ex)
        {
            this.logger.LogError($"Exception in submitting solution {submissions} by {Environment.NewLine}{ex.Message}{Environment.NewLine}{ex.InnerException}");
            throw;
        }
    }
}