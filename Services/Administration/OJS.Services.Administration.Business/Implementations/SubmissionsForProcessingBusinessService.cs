namespace OJS.Services.Administration.Business.Implementations;

using System;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.AutoMapper.Infrastructure.Extensions;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly ISubmissionsDataService submissionsData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        ISubmissionsDataService submissionsData,
        ISubmissionsCommonBusinessService submissionsCommonBusinessService)
    {
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.submissionsData = submissionsData;
        this.submissionsCommonBusinessService = submissionsCommonBusinessService;
    }

    /// <summary>
    /// Sets the Processing property to False for all submissions
    /// thus ensuring that the worker will process them eventually instead
    /// of getting stuck in perpetual "Processing..." state.
    /// </summary>
    public async Task ResetAllProcessingSubmissions()
    {
        var allProcessingSubmissionIds = await this.submissionsForProcessingData.GetIdsOfAllProcessing();

        if (allProcessingSubmissionIds.Count() <= 0)
        {
            return;
        }

        foreach (var submissionForProcessingId in allProcessingSubmissionIds)
        {
            await this.submissionsForProcessingData.ResetProcessingStatusById(submissionForProcessingId);
        }
    }

    public async Task<int> EnqueuePendingSubmissions()
    {
        var submissionsForProcessing = (await this.submissionsForProcessingData
            .GetAllPending()
            .ToListAsync())
            .Where(sfp => Math.Abs(sfp!.CreatedOn.Subtract(DateTime.UtcNow).TotalMinutes) >= 1)
            .ToList();

        if (!submissionsForProcessing.Any())
        {
            return 0;
        }

        var submissions = await this.submissionsData
            .GetByIds(submissionsForProcessing
                .Select(sp => sp!.SubmissionId))
            .MapCollection<SubmissionServiceModel>()
            .ToListAsync();

        await submissions
            .ForEachSequential((submission) =>
                this.submissionsCommonBusinessService
                    .PublishSubmissionForProcessing(submission));

        return submissions.Count;
    }

    public async Task DeleteProcessedSubmissions()
    {
        this.submissionsForProcessingData.Delete(sfp => sfp.Processed && !sfp.Processing);
        await this.submissionsForProcessingData.SaveChanges();
    }
}