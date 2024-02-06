namespace OJS.Services.Administration.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using OJS.Services.Administration.Models.Submissions;

    public interface ISubmissionsBusinessService : IAdministrationOperationService<Submission, SubmissionAdministrationServiceModel>
    {
        Task RecalculatePointsByProblem(int problemId);

        Task<ServiceResult> Retest(Submission submission);

        Task<ServiceResult> Retest(int id);

        Task<SubmissionAdministrationServiceModel> Download(int id);

        Task<bool> IsBestSubmission(int problemId, int participantId, int submissionId);
    }
}