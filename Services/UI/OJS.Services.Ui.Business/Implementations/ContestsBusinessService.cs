namespace OJS.Services.Ui.Business.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Contests;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ContestsBusinessService : IContestsBusinessService
    {
        private const int DefaultPastContestsToTake = 15;

        private readonly IContestsDataService contestsData;
        private readonly IExamGroupsDataService examGroupsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IParticipantScoresDataService participantScoresData;

        public ContestsBusinessService(
            IContestsDataService contestsData,
            IExamGroupsDataService examGroupsData,
            IParticipantsDataService participantsData,
            IParticipantScoresDataService participantScoresData)
        {
            this.contestsData = contestsData;
            this.examGroupsData = examGroupsData;
            this.participantsData = participantsData;
            this.participantScoresData = participantScoresData;
        }

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable()
            => await this.contestsData
                .GetAllCompetable<ContestForHomeIndexServiceModel>()
                .OrderByAsync(ac => ac.EndTime);

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPast()
            => await this.contestsData
                .GetAllPast<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(pc => pc.EndTime)
                .TakeAsync(DefaultPastContestsToTake);

        public Task<bool> IsContestIpValidByContestAndIp(int contestId, string ip)
            => this.contestsData
                .Exists(c =>
                    c.Id == contestId &&
                    (!c.IpsInContests.Any() || c.IpsInContests.Any(ai => ai.Ip.Value == ip)));

        public async Task<bool> CanUserCompeteByContestByUserAndIsAdmin(
            int contestId,
            string userId,
            bool isAdmin,
            bool allowToAdminAlways = false)
        {
            var contest = await this.contestsData
                .GetByIdQuery(contestId)
                .Include(c => c.Participants)
                .FirstOrDefaultAsync();

            var isUserAdminOrLecturerInContest = isAdmin || await this.contestsData
                .IsUserLecturerInByContestAndUser(contestId, userId);

            if (contest.IsOnline && !isUserAdminOrLecturerInContest)
            {
                var participant = contest.Participants.FirstOrDefault(p => p.UserId == userId && p.IsOfficial);

                if (participant == null)
                {
                    return contest.CanBeCompeted;
                }

                return participant.ParticipationEndTime >= DateTime.Now;
            }

            if (contest.CanBeCompeted || (isUserAdminOrLecturerInContest && allowToAdminAlways))
            {
                return true;
            }

            if (isUserAdminOrLecturerInContest && contest.IsActive)
            {
                return true;
            }

            return false;
        }

        // TODO: Extract different logic blocks in separate services
        public async Task<ServiceResult> TransferParticipantsToPracticeById(int contestId)
        {
            var contest = await this.contestsData
                .GetByIdQuery(contestId)
                .Include(c => c.Participants)
                .FirstOrDefaultAsync();

            if (contest == null)
            {
                return new ServiceResult("Contest cannot be found");
            }

            if (contest.IsActive)
            {
                return new ServiceResult("The Contest is active and participants cannot be transferred");
            }

            var competeOnlyParticipants = contest.Participants
                .GroupBy(p => p.UserId)
                .Where(g => g.Count() == 1 && g.All(p => p.IsOfficial))
                .Select(gr => gr.FirstOrDefault());

            foreach (var participant in competeOnlyParticipants)
            {
                foreach (var participantScore in participant.Scores)
                {
                    participantScore.IsOfficial = false;
                }

                participant.IsOfficial = false;
            }

            var competeAndPracticeParticipants = contest.Participants
                .GroupBy(p => p.UserId)
                .Where(g => g.Count() == 2)
                .ToDictionary(grp => grp.Key, grp => grp.OrderBy(p => p.IsOfficial));

            var participantsForDeletion = new List<Participant>();

            foreach (var competeAndPracticeParticipant in competeAndPracticeParticipants)
            {
                var unofficialParticipant = competeAndPracticeParticipants[competeAndPracticeParticipant.Key].First();
                var officialParticipant = competeAndPracticeParticipants[competeAndPracticeParticipant.Key].Last();
                participantsForDeletion.Add(officialParticipant);

                foreach (var officialParticipantSubmission in officialParticipant.Submissions)
                {
                    officialParticipantSubmission.Participant = unofficialParticipant;
                }

                var scoresForDeletion = new List<ParticipantScore>();

                foreach (var officialParticipantScore in officialParticipant.Scores)
                {
                    var unofficialParticipantScore = unofficialParticipant
                        .Scores
                        .FirstOrDefault(s => s.ProblemId == officialParticipantScore.ProblemId);

                    if (unofficialParticipantScore != null)
                    {
                        if (unofficialParticipantScore.Points < officialParticipantScore.Points ||
                            (unofficialParticipantScore.Points == officialParticipantScore.Points &&
                             unofficialParticipantScore.Id < officialParticipantScore.Id))
                        {
                            unofficialParticipantScore = officialParticipantScore;
                            unofficialParticipantScore.IsOfficial = false;
                            unofficialParticipantScore.Participant = unofficialParticipant;
                        }

                        scoresForDeletion.Add(officialParticipantScore);
                    }
                    else
                    {
                        officialParticipantScore.IsOfficial = false;
                        officialParticipantScore.Participant = unofficialParticipant;
                    }
                }

                await this.participantScoresData.Delete(scoresForDeletion);
            }

            await this.participantsData.Delete(participantsForDeletion);

            return ServiceResult.Success;
        }

        public async Task DeleteById(int id)
        {
            await this.examGroupsData.RemoveContestByContest(id);

            await this.contestsData.DeleteById(id);
            await this.contestsData.SaveChanges();
        }
    }
}