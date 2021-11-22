using System.Threading.Tasks;

namespace OJS.Services.Administration.Business
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Linq;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task HardDeleteAllArchived();
    }
}