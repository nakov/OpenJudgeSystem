namespace OJS.Services.Ui.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Data;
using System.Threading.Tasks;

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
}