namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ISubmissionTypesDataService : IDataService<SubmissionType>
    {
        IQueryable<SubmissionType> GetAllByProblem(int problemId);

        Task<IEnumerable<TServiceModel>> GetAllOrderedByMostUsed<TServiceModel>();
    }
}