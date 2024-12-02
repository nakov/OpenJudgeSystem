namespace OJS.Services.Ui.Business.Implementations
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Problems;
    using OJS.Services.Infrastructure.Extensions;

    public class ParticipantScoresBusinessService : IParticipantScoresBusinessService
    {
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IParticipantsDataService participantsData;
        private readonly IProblemsDataService problemsDataService;
        private readonly IUserProviderService userProviderService;

        public ParticipantScoresBusinessService(
            IParticipantScoresDataService participantScoresData,
            IParticipantsDataService participantsData,
            IProblemsDataService problemsDataService,
            IUserProviderService userProviderService)
        {
            this.participantScoresData = participantScoresData;
            this.participantsData = participantsData;
            this.problemsDataService = problemsDataService;
            this.userProviderService = userProviderService;
        }

        public async Task SaveForSubmission(Participant participant, Submission submission)
        {
            var existingScore = await this.participantScoresData.GetByParticipantIdProblemIdAndIsOfficial(
                submission.ParticipantId,
                submission.ProblemId,
                participant.IsOfficial);

            if (existingScore == null)
            {
                await this.participantScoresData.AddBySubmissionByUsernameAndIsOfficial(
                    submission,
                    participant.User.UserName!,
                    participant.IsOfficial,
                    participant);

                return;
            }

            if (submission.Points > existingScore.Points ||
                submission.Id == existingScore.SubmissionId)
            {
                await this.participantScoresData.UpdateBySubmissionAndPoints(
                    existingScore,
                    submission.Id,
                    submission.Points,
                    participant);
            }
        }

        public async Task<IEnumerable<ProblemResultServiceModel>> GetParticipantScoresByProblemForUser(
            int problemId,
            bool isOfficial)
        {
            var problem = await this.problemsDataService.GetWithProblemGroupById(problemId);

            if (problem == null)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.ProblemNotFound);
            }

            var user = this.userProviderService.GetCurrentUser();

            var userHasParticipation = await this.participantsData
                .ExistsByContestByUserAndIsOfficial(problem.ProblemGroup.ContestId, user.Id!, isOfficial);

            if (!userHasParticipation)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.UserIsNotRegisteredForExam);
            }

            if (!problem.ShowResults)
            {
                throw new BusinessServiceException(Resources.ContestsGeneral.ProblemResultsNotAvailable);
            }

            var participant =
                await this.participantsData.GetByContestByUserAndByIsOfficial(
                    problem.ProblemGroup.ContestId,
                    user.Id!,
                    isOfficial);

            var results = await this.participantScoresData
                .GetAll()
                .Where(ps =>
                    ps.ProblemId == problem.Id && ps.IsOfficial == isOfficial && ps.ParticipantId == participant!.Id)
                .MapCollection<ProblemResultServiceModel>()
                .ToListAsync();

            return results;
        }
    }
}