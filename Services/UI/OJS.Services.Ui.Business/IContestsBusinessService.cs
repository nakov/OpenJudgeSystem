namespace OJS.Services.Ui.Business
{
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IContestsBusinessService : IService
    {
        Task<ContestParticipationServiceModel> StartContestParticipation(StartContestParticipationServiceModel mode);

        Task<ContestsForHomeIndexServiceModel> GetAllForHomeIndex();

        Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable();

        Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPast();

        Task<bool> IsContestIpValidByContestAndIp(int contestId, string ip);

        /// <summary>
        /// Determines if a user can compete in a contest, depending of his role and the contest type
        /// </summary>
        /// <param name="contestId">The id of the contest</param>
        /// <param name="userId">The id of the user</param>
        /// <param name="isAdmin">Is the user administrator in the system</param>
        /// <param name="allowToAdminAlways">If true, and the user is admin he will always be able to compete</param>
        Task<bool> CanUserCompeteByContestByUserAndIsAdmin(
            int contestId,
            string userId,
            bool isAdmin,
            bool allowToAdminAlways = false);

        Task<ServiceResult> TransferParticipantsToPracticeById(int contestId);

        Task DeleteById(int id);
    }
}