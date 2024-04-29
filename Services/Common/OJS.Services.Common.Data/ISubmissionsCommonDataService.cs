namespace OJS.Services.Common.Data;

using OJS.Data.Models.Submissions;
using System.Linq;
using System.Threading.Tasks;

public interface ISubmissionsCommonDataService : IDataService<Submission>
{
    IQueryable<Submission> GetAllPending();

    IQueryable<Submission> GetAllProcessing();

    Task<int> GetAllUnprocessedCount();
}