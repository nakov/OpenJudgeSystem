namespace OJS.Services.Ui.Business.Implementations;

using OJS.Common.Enumerations;
using OJS.Services.Common.Data;
using System.Linq;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData)
        => this.submissionsForProcessingData = submissionsForProcessingData;

    public bool IsSubmissionProcessing(int submissionId)
        => this.submissionsForProcessingData
            .GetQuery(s => s.SubmissionId == submissionId && s.State != SubmissionProcessingState.Processed)
            .Any();
}