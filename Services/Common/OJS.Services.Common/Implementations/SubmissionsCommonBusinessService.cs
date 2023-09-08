namespace OJS.Services.Common.Implementations;

using System;
using System.Threading.Tasks;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using Microsoft.Extensions.Logging;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class SubmissionsCommonBusinessService : ISubmissionsCommonBusinessService
{
    private readonly ISubmissionPublisherService submissionPublisherService;
    private readonly ISubmissionsForProcessingCommonDataService submissionForProcessingData;
    private readonly ILogger<SubmissionsCommonBusinessService> logger;
    private readonly IDataService<Submission> dataService;

    public SubmissionsCommonBusinessService(
        ISubmissionPublisherService submissionPublisherService,
        ISubmissionsForProcessingCommonDataService submissionForProcessingData,
        ILogger<SubmissionsCommonBusinessService> logger,
        IDataService<Submission> dataService)
    {
        this.submissionPublisherService = submissionPublisherService;
        this.submissionForProcessingData = submissionForProcessingData;
        this.logger = logger;
        this.dataService = dataService;
    }

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
}