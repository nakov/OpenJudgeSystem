namespace OJS.Services.Administration.Business
{
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<ServiceResult> Retest(Submission submission);
        // Task HardDeleteAllArchived();

        Task<bool> IsBestSubmission(int problemId, int participantId, int submissionId);
    }
}