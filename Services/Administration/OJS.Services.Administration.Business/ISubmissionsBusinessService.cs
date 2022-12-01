using System.Threading.Tasks;
using OJS.Services.Common.Models;

namespace OJS.Services.Administration.Business
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Linq;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<ServiceResult> Retest(Submission submission);
        // Task HardDeleteAllArchived();

        Task<bool> IsBestSubmission(int problemId, int participantId, int submissionId);
    }
}