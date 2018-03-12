﻿namespace OJS.Services.Business.Participants
{
    using System;
    using System.Data.Entity.SqlServer;
    using System.Linq;
    using OJS.Common.Models;
    using OJS.Data.Models;
    using OJS.Services.Data.Contests;
    using OJS.Services.Data.Participants;

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

        public Participant CreateNewByContestByUserByIsOfficialAndIsAdmin(
            Contest contest,
            string userId,
            bool isOfficial,
            bool isAdmin)
        {
            Participant participant;
            if (contest.IsOnline)
            {
                participant = new Participant(contest.Id, userId, isOfficial)
                {
                    ContestStartTime = DateTime.Now,
                    ContestEndTime = DateTime.Now + contest.Duration
                };

                if (isOfficial &&
                    !isAdmin &&
                    !this.contestsData.IsUserLecturerInByContestAndUser(contest.Id, userId))
                {
                    this.AssignRandomProblemsToParticipant(participant, contest);
                }
            }
            else
            {
                participant = new Participant(contest.Id, userId, isOfficial);
            }

            this.participantsData.Add(participant);
            return participant;
        }

        public void UpdateContestEndTimeForAllParticipantsByContestByParticipantContestStartTimeRangeAndTimeIntervalInMinutes(
            int contestId,
            int minutes,
            DateTime contestStartTimeRangeStart,
            DateTime contestStartTimeRangeEnd)
        {
            var contest = this.contestsData.GetById(contestId);
            var contestTotalDurationInMinutes = contest.Duration.Value.TotalMinutes;

            var participantsInTimeRange =
                this.participantsData.GetAllOfficialInOnlineContestByContestAndContestStartTimeRange(
                    contestId,
                    contestStartTimeRangeStart,
                    contestStartTimeRangeEnd);

            this.participantsData.Update(
                participantsInTimeRange
                    .Where(p => SqlFunctions.DateAdd("minute", minutes, p.ContestEndTime) >=
                        SqlFunctions.DateAdd("minute", contestTotalDurationInMinutes, p.ContestStartTime)),
                p => new Participant
                {
                    ContestEndTime = SqlFunctions.DateAdd(
                    "minute",
                    minutes,
                    p.ContestEndTime)
                });
        }

        public IQueryable<Participant> GetAllParticipantsWhoWouldBeReducedBelowDefaultContestDuration(
            int contestId,
            int minutes,
            DateTime contestStartTimeRangeStart,
            DateTime contestStartTimeRangeEnd)
        {
            var contest = this.contestsData.GetById(contestId);
            var contestTotalDurationInMinutes = contest.Duration.Value.TotalMinutes;

            var participantsInvalidForUpdate =
                this.participantsData
                    .GetAllOfficialInOnlineContestByContestAndContestStartTimeRange(
                        contestId,
                        contestStartTimeRangeStart,
                        contestStartTimeRangeEnd)
                    .Where(p => SqlFunctions.DateAdd("minute", minutes, p.ContestEndTime) <
                                SqlFunctions.DateAdd("minute", contestTotalDurationInMinutes, p.ContestStartTime));            

            return participantsInvalidForUpdate;
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
                    participant.Problems.Add(randomProblem);
                }
            }
        }
    }
}