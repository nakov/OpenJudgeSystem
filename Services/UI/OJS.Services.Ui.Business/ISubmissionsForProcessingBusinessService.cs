namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;

public interface ISubmissionsForProcessingBusinessService : IService
{
    bool IsSubmissionProcessing(int submissionId);
}