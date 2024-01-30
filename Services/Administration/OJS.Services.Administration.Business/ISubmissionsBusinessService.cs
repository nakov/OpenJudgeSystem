namespace OJS.Services.Administration.Business
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsBusinessService : IService
    {
        Task<IEnumerable<SubmissionService>> GetAll();

        Task RecalculatePointsByProblem(int problemId);

        Task<ServiceResult> Retest(Submission submission);

        Task<ServiceResult> Retest(int id);

        Task<bool> IsBestSubmission(int problemId, int participantId, int submissionId);
    }
}