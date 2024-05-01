﻿namespace OJS.Services.Administration.Business.SubmissionsForProcessing;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Common;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class SubmissionsForProcessingBusinessService :
    AdministrationOperationService<SubmissionForProcessing, int, SubmissionsForProcessingAdministrationServiceModel>,
    ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly ISubmissionsCommonDataService submissionsCommonData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        ISubmissionsCommonDataService submissionsCommonData,
        ISubmissionsCommonBusinessService submissionsCommonBusinessService)
    {
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.submissionsCommonData = submissionsCommonData;
        this.submissionsCommonBusinessService = submissionsCommonBusinessService;
    }

    public override async Task<SubmissionsForProcessingAdministrationServiceModel> Get(int id)
    {
        var submission = await this.submissionsForProcessingData
            .GetByIdQuery(id)
            .MapCollection<SubmissionsForProcessingAdministrationServiceModel>()
            .FirstOrDefaultAsync();

        if (submission == null)
        {
            throw new BusinessServiceException("Submission not found");
        }

        return submission;
    }

    public async Task<int> EnqueuePendingSubmissions()
    {
        var pendingSubmissions = await this.submissionsCommonData
            .GetAllPending()
            .Include(s => s.SubmissionType)
            .MapCollection<SubmissionServiceModel>()
            .ToListAsync();

        if (pendingSubmissions.IsEmpty())
        {
            return 0;
        }

        await this.submissionsCommonBusinessService.PublishSubmissionsForProcessing(pendingSubmissions);

        return pendingSubmissions.Count;
    }

    public async Task DeleteProcessedSubmissions()
    {
        this.submissionsForProcessingData.Delete(sfp => sfp.Processed && !sfp.Processing);
        await this.submissionsForProcessingData.SaveChanges();
    }
}