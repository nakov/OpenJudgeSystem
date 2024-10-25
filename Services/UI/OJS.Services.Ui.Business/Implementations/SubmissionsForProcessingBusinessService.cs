namespace OJS.Services.Ui.Business.Implementations;

using OJS.Common.Enumerations;
using OJS.Services.Common.Data;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData)
        => this.submissionsForProcessingData = submissionsForProcessingData;

    public async Task<bool> IsSubmissionProcessing(int submissionId)
        => await this.submissionsForProcessingData
            .All(s => s.SubmissionId == submissionId && s.State != SubmissionProcessingState.Processed)
            .AnyAsync();
}