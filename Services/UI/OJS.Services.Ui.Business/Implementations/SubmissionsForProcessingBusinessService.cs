namespace OJS.Services.Ui.Business.Implementations;

using OJS.Common.Enumerations;
using OJS.Services.Common.Data;
using System.Threading.Tasks;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData)
        => this.submissionsForProcessingData = submissionsForProcessingData;

    public async Task<bool> IsSubmissionProcessing(int submissionId)
        => await this.submissionsForProcessingData
            .Exists(s => s.SubmissionId == submissionId && s.State != SubmissionProcessingState.Processed);
}