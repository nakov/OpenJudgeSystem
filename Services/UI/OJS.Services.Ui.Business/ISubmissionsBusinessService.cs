namespace OJS.Services.Ui.Business
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Services.Ui.Models.Submissions;
    using System.Collections.Generic;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<IEnumerable<SubmissionServiceModel>> GetForProfileByUser(string username);

        // Task HardDeleteAllArchived();
    }
}