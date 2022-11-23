namespace OJS.Services.Administration.Business
{
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        // Task HardDeleteAllArchived();
    }
}