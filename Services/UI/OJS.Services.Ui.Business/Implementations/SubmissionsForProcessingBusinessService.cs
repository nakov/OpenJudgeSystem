namespace OJS.Services.Ui.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Data;
using System.Threading.Tasks;
using System.Linq;

public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;

    public SubmissionsForProcessingBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData)
        => this.submissionsForProcessingData = submissionsForProcessingData;

    public Task<int> GetUnprocessedTotalCount()
        => this.submissionsForProcessingData
            .GetAllUnprocessed()
            .CountAsync();

    public bool IsSubmissionProcessing(int submissionId)
    {
        var result = this.submissionsForProcessingData
            .GetQuery(s => s.SubmissionId == submissionId)
            .FirstOrDefault();

        return result != null ? !result.Processing : true;
    }
}