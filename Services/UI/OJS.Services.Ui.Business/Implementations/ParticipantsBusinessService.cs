namespace OJS.Services.Ui.Business.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using SharedResource = OJS.Common.Resources.ContestsGeneral;
    using Resource = OJS.Common.Resources.ParticipantsBusiness;

    public class ParticipantsBusinessService : IParticipantsBusinessService
    {
        private readonly IParticipantsDataService participantsData;
        private readonly IContestsDataService contestsData;

        public ParticipantsBusinessService(
            IParticipantsDataService participantsData,
            IContestsDataService contestsData)
        {
            this.participantsData = participantsData;
            this.contestsData = contestsData;
        }

        public async Task<Participant> CreateNewByContestByUserByIsOfficialAndIsAdmin(
            Contest contest,
            string userId,
            bool isOfficial,
            bool isAdmin)
        {
            var participant = new Participant(contest.Id, userId, isOfficial);

            if (contest.IsOnline && isOfficial)
            {
                participant.ParticipationStartTime = DateTime.Now;
                participant.ParticipationEndTime = DateTime.Now + contest.Duration;

                var isUserLecturerInByContestAndUser =
                    await this.contestsData.IsUserLecturerInByContestAndUser(contest.Id, userId);

                if (!isAdmin && !isUserLecturerInByContestAndUser)
                {
                    this.AssignRandomProblemsToParticipant(participant, contest);
                }
            }

            await this.participantsData.Add(participant);
            await this.participantsData.SaveChanges();
            return participant;
        }

        public async Task<ServiceResult<string>> UpdateParticipationEndTimeByIdAndTimeInMinutes(int id, int minutes)
        {
            var participant = await this.participantsData
                .GetByIdQuery(id)
                .Include(p => p.Contest)
                .Include(p => p.User)
                .FirstOrDefaultAsync();

            if (participant == null)
            {
                throw new ArgumentException(Resource.Participant_does_not_exist);
            }

            if (!participant.Contest.Duration.HasValue)
            {
                return new ServiceResult<string>(Resource.Contest_duration_not_set);
            }

            if (!participant.ParticipationEndTime.HasValue ||
                !participant.ParticipationStartTime.HasValue)
            {
                throw new ArgumentException(Resource.Participant_participation_time_not_set);
            }

            var newEndTime = participant.ParticipationEndTime.Value.AddMinutes(minutes);
            var minAllowedEndTime = participant.ParticipationStartTime.Value
                .AddMinutes(participant.Contest.Duration.Value.TotalMinutes);

            if (newEndTime < minAllowedEndTime)
            {
                return new ServiceResult<string>(Resource.Participation_time_reduce_below_duration_warning);
            }

            participant.ParticipationEndTime = newEndTime;

            this.participantsData.Update(participant);

            return ServiceResult<string>.Success(participant.User.UserName);
        }

        public async Task<ServiceResult<ICollection<string>>> UpdateParticipationsEndTimeByContestByParticipationStartTimeRangeAndTimeInMinutes(
            int contestId,
            int timeInMinutes,
            DateTime participationStartTimeRangeStart,
            DateTime participationStartTimeRangeEnd)
        {
            var contest = await this.contestsData.OneById(contestId);

            if (contest == null)
            {
                return new ServiceResult<ICollection<string>>(SharedResource.Contest_not_found);
            }

            if (!contest.Duration.HasValue)
            {
                return new ServiceResult<ICollection<string>>(Resource.Contest_duration_not_set);
            }

            var contestTotalDurationInMinutes = contest.Duration.Value.TotalMinutes;

            var invalidForUpdateParticipantUsernames =
                this.participantsData
                    .GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
                        contestId,
                        participationStartTimeRangeStart,
                        participationStartTimeRangeEnd)
                    .Where(p =>
                        p.ParticipationEndTime!.Value.AddMinutes(timeInMinutes) <
                        p.ParticipationStartTime!.Value.AddMinutes(contestTotalDurationInMinutes))
                    .Select(p => p.User.UserName)
                    .ToList();

            var participantsInTimeRange =
                this.participantsData.GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
                    contestId,
                    participationStartTimeRangeStart,
                    participationStartTimeRangeEnd);

            await this.participantsData.Update(
                participantsInTimeRange
                    .Where(p =>
                        p.ParticipationEndTime!.Value.AddMinutes(timeInMinutes) >=
                        p.ParticipationStartTime!.Value.AddMinutes(contestTotalDurationInMinutes)),
                p => new Participant
                {
                    ParticipationEndTime = p.ParticipationEndTime!.Value.AddMinutes(timeInMinutes),
                });

            return ServiceResult<ICollection<string>>.Success(invalidForUpdateParticipantUsernames);
        }

        private void AssignRandomProblemsToParticipant(Participant participant, Contest contest)
        {
            var random = new Random();

            var problemGroups = contest.ProblemGroups
                .Where(pg => !pg.IsDeleted && pg.Problems.Any(p => !p.IsDeleted));

            foreach (var problemGroup in problemGroups)
            {
                var problemsInGroup = problemGroup.Problems.Where(p => !p.IsDeleted).ToList();
                if (problemsInGroup.Any())
                {
                    var randomProblem = problemsInGroup[random.Next(0, problemsInGroup.Count)];
                    participant.ProblemsForParticipants.Add(new ProblemForParticipant
                    {
                        Participant = participant,
                        Problem = randomProblem,
                    });
                }
            }
        }
    }
}