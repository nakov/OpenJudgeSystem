namespace OJS.Services.Ui.Business.Implementations;

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using OJS.Services.Common.Models.Submissions;
using Microsoft.EntityFrameworkCore;
using SoftUni.AutoMapper.Infrastructure.Extensions;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly Data.ISubmissionsForProcessingDataService submissionsForProcessingData;
    private readonly IUserProviderService userProviderService;

    public SubmissionsForProcessingBusinessService(
        Data.ISubmissionsForProcessingDataService submissionsForProcessingData,
        IUserProviderService userProviderService)
    {
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.userProviderService = userProviderService;
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

    public Task<int> GetUnprocessedTotalCount()
        => this.submissionsForProcessingData.GetAllUnprocessedCount();

    public async Task<IEnumerable<SubmissionForProcessingServiceModel>> GetAllStale()
        => await this.submissionsForProcessingData
            .GetAllUnprocessed()
            .Where(sp => DateTime.UtcNow.Subtract(sp.CreatedOn).TotalMinutes >= 2)
            .MapCollection<SubmissionForProcessingServiceModel>()
            .ToListAsync();
}