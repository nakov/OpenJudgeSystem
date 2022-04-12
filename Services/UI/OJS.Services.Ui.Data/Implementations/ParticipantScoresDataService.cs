using FluentExtensions.Extensions;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections;
using X.PagedList;

namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Extensions;
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Ui.Models.Participations;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ParticipantScoresDataService : DataService<ParticipantScore>, IParticipantScoresDataService
    {
        private readonly IParticipantsDataService participantsData;

        public ParticipantScoresDataService(
            OjsDbContext db,
            IParticipantsDataService participantsData)
            : base(db)
            => this.participantsData = participantsData;

        public Task<ParticipantScore?> GetByParticipantIdAndProblemId(int participantId, int problemId) =>
            this.DbSet
                .FirstOrDefaultAsync(ps =>
                    ps.ParticipantId == participantId &&
                    ps.ProblemId == problemId);

        public Task<IEnumerable<ParticipantScore>> GetByProblemIdAndParticipants(IEnumerable<int> participantIds,
            int problemId)
            => this.DbSet
                .Where(ps => ps.ProblemId == problemId)
                .Where(p => participantIds.Contains(p.ParticipantId))
                .ToEnumerableAsync();

        public Task<ParticipantScore?> GetByParticipantIdProblemIdAndIsOfficial(int participantId, int problemId, bool isOfficial) =>
            this.DbSet
                .FirstOrDefaultAsync(ps =>
                    ps.ParticipantId == participantId &&
                    ps.ProblemId == problemId &&
                    ps.IsOfficial == isOfficial);

        public IQueryable<ParticipantScore> GetAll() =>
            this.DbSet;

        public IQueryable<ParticipantScore> GetAllByProblem(int problemId) =>
            this.GetAll()
                .Where(ps => ps.ProblemId == problemId);

        public IQueryable<ParticipantScore> GetAllHavingPointsExceedingLimit() =>
            this.GetAll()
                .Where(ps => ps.Points > ps.Problem.MaximumPoints);

        public async Task ResetBySubmission(Submission submission)
        {
            if (submission.ParticipantId == null || submission.ProblemId == null)
            {
                return;
            }

            var participant = await this.participantsData
                .GetByIdQuery(submission.ParticipantId.Value)
                .Select(p => new
                {
                    p.IsOfficial,
                    p.User.UserName
                })
                .FirstOrDefaultAsync();

            if (participant == null)
            {
                return;
            }

            var existingScore = await this.GetByParticipantIdProblemIdAndIsOfficial(
                submission.ParticipantId.Value,
                submission.ProblemId.Value,
                participant.IsOfficial);

            if (existingScore == null)
            {
                await this.AddBySubmissionByUsernameAndIsOfficial(submission, participant.UserName, participant.IsOfficial);
            }
            else
            {
                await this.UpdateBySubmissionAndPoints(existingScore, submission.Id, submission.Points);
            }
        }

        public Task DeleteAllByProblem(int problemId) =>
            this.DbSet
                .Where(x => x.ProblemId == problemId)
                .DeleteFromQueryAsync();

        public async Task DeleteForParticipantByProblem(int participantId, int problemId)
        {
            var isOfficial = await this.participantsData.IsOfficialById(participantId);

            var existingScore = await this.GetByParticipantIdProblemIdAndIsOfficial(participantId, problemId, isOfficial);

            if (existingScore != null)
            {
                this.Delete(existingScore);
                await this.SaveChanges();
            }
        }

        public async Task Delete(IEnumerable<ParticipantScore> participantScores)
        {
            foreach (var participantScore in participantScores)
            {
                this.Delete(participantScore);
            }

            await this.SaveChanges();
        }

        public async Task AddBySubmissionByUsernameAndIsOfficial(Submission submission, string username, bool isOfficial)
        {
            await this.Add(new ParticipantScore
            {
                ParticipantId = submission.ParticipantId!.Value,
                ProblemId = submission.ProblemId!.Value,
                SubmissionId = submission.Id,
                ParticipantName = username,
                Points = submission.Points,
                IsOfficial = isOfficial,
            });

            await this.SaveChanges();
        }

        public async Task UpdateBySubmissionAndPoints(
            ParticipantScore participantScore,
            int? submissionId,
            int submissionPoints)
        {
            participantScore.SubmissionId = submissionId;
            participantScore.Points = submissionPoints;

            this.Update(participantScore);
            await this.SaveChanges();
        }

        public Task RemoveSubmissionIdsBySubmissionIds(IEnumerable<int> submissionIds) =>
            this.DbSet
                .Where(ps => submissionIds.Cast<int?>().Contains(ps.SubmissionId))
                .UpdateFromQueryAsync(
                    ps => new ParticipantScore
                    {
                        SubmissionId = null
                    });

        public Task<IEnumerable<ParticipationForProblemMaxScoreServiceModel>> GetMaxByProblemIdsAndParticipation(
            IEnumerable<int> problemIds, IEnumerable<int> participantIds)
            => this.DbSet
                .Where(ps =>
                    problemIds.Contains(ps.ProblemId)
                    && participantIds.Contains(ps.ParticipantId))
                .GroupBy(ps => ps.ProblemId)
                .Select(ps =>
                    new ParticipationForProblemMaxScoreServiceModel
                    {
                        ProblemId = ps.Key,
                        Points = ps.Select(ps => ps.Points)
                            .Max(),
                    })
                .ToEnumerableAsync();
    }
}