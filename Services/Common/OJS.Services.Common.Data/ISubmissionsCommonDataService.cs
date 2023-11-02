namespace OJS.Services.Common.Data;

using OJS.Data.Models.Submissions;
using System.Linq;

public interface ISubmissionsCommonDataService : IDataService<Submission>
{
    IQueryable<Submission> GetAllPending();

    IQueryable<Submission> GetAllProcessing();
}