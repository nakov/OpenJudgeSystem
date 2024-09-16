namespace OJS.Services.Ui.Business
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Models;
    using OJS.Services.Infrastructure;

    public interface IParticipantsBusinessService : IService
    {
        Task<Participant> CreateNewByContestByUserByIsOfficialAndIsAdminOrLecturer(
            Contest contest,
            string userId,
            bool isOfficial,
            bool isAdminOrLecturer);

        Task<ServiceResult<string>> UpdateParticipationEndTimeByIdAndTimeInMinutes(int id, int minutes);

        /// <summary>
        /// Updates contest duration for participants in contest,
        /// in time range with amount of minutes provided. If any participants' contest duration
        /// would be reduced below the base contest duration they are not updated, but returned in the result data.
        /// </summary>
        /// <param name="contestId">The id of the contest.</param>
        /// <param name="minutes">Amount of minutes to be added to the participant's contest end time.
        /// Amount can be negative.</param>
        /// <param name="participationStartTimeRangeStart">The lower bound against which participants' participation start time would be checked.</param>
        /// <param name="participationStartTimeRangeEnd">The upper bound against which participants' participation start time would be checked.</param>
        Task<ServiceResult<ICollection<string>>> UpdateParticipationsEndTimeByContestByParticipationStartTimeRangeAndTimeInMinutes(
            int contestId,
            int minutes,
            DateTime participationStartTimeRangeStart,
            DateTime participationStartTimeRangeEnd);
    }
}