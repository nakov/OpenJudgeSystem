namespace OJS.Services.Common.Implementations;

using Microsoft.Extensions.Logging;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsCommonBusinessService : ISubmissionsCommonBusinessService
{
    private readonly IPublisherService publisher;
    private readonly ISubmissionsCommonDataService submissionsCommonDataService;
    private readonly ISubmissionsForProcessingCommonDataService submissionForProcessingData;
    private readonly ILogger<SubmissionsCommonBusinessService> logger;

    public SubmissionsCommonBusinessService(
        IPublisherService publisher,
        ISubmissionsCommonDataService submissionsCommonDataService,
        ISubmissionsForProcessingCommonDataService submissionForProcessingData,
        ILogger<SubmissionsCommonBusinessService> logger)
    {
        this.publisher = publisher;
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

    public async Task PublishSubmissionForProcessing(SubmissionServiceModel submission, SubmissionForProcessing submissionForProcessing)
    {
        try
        {
            var pubSubModel = submission.Map<SubmissionForProcessingPubSubModel>();
            await this.publisher.Publish(pubSubModel);
        }
        catch (Exception ex)
        {
            this.logger.LogExceptionSubmittingSolution(submission.Id, ex);
            throw;
        }

        // We detach the entity to ensure we get fresh data from the database.
        this.submissionForProcessingData.Detach(submissionForProcessing);
        var freshSubmissionForProcessing = await this.submissionForProcessingData.Find(submissionForProcessing.Id);

        if (freshSubmissionForProcessing == null || freshSubmissionForProcessing.SubmissionId != submission.Id)
        {
            this.logger.LogSubmissionForProcessingNotFoundForSubmission(submissionForProcessing.Id, submission.Id);
        }
        else if (freshSubmissionForProcessing.Processed)
        {
            // Race condition can occur and the submission can already be marked as processed when we reach this point,
            // but it is not a problem, as the submission is processed and there is no need to touch it anymore.
            this.logger.LogSubmissionAlreadyProcessed(submission.Id);
        }
        else
        {
            this.submissionForProcessingData.MarkProcessing(freshSubmissionForProcessing);
            await this.submissionForProcessingData.SaveChanges();
        }
    }

    public async Task PublishSubmissionsForProcessing(ICollection<SubmissionServiceModel> submissions)
    {
        try
        {
            var pubSubModels = submissions.MapCollection<SubmissionForProcessingPubSubModel>();
            await this.publisher.PublishBatch(pubSubModels);
        }
        catch (Exception ex)
        {
            this.logger.LogExceptionSubmittingSolutionsBatch(ex);
            throw;
        }

        var submissionsIds = submissions.Select(s => s.Id).ToList();

        await this.submissionForProcessingData.MarkMultipleForProcessing(submissionsIds);
    }
}