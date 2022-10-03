using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using SoftUni.Services.Infrastructure;
using System.Linq;

namespace OJS.Services.Administration.Data
{
    public interface ISubmissionTypesDataService : IService, IDataService<SubmissionType>
    {
        IQueryable<SubmissionType> GetAllByProblem(int problemId);
    }
}