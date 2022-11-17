namespace OJS.Services.Ui.Business.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common;
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Contests;
    using OJS.Data.Models.Contests;
    using OJS.Services.Infrastructure.Exceptions;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.Common.Models;
    using OJS.Services.Infrastructure.Constants;
    using OJS.Services.Ui.Business.Validation;

    public class ContestsBusinessService : IContestsBusinessService
    {
        private const int DefaultContestsToTake = 4;
        private const int DefaultContestsPerPage = 12;

        private readonly IContestsDataService contestsData;
        private readonly IExamGroupsDataService examGroupsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IParticipantsBusinessService participantsBusiness;
        private readonly IContestCategoriesCacheService contestCategoriesCache;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IUsersBusinessService usersBusinessService;
        private readonly IUserProviderService userProviderService;
        private readonly IContestValidationService contestValidationService;

        public ContestsBusinessService(
            IContestsDataService contestsData,
            IExamGroupsDataService examGroupsData,
            IParticipantsDataService participantsData,
            IParticipantScoresDataService participantScoresData,
            IUsersBusinessService usersBusinessService,
            IUserProviderService userProviderService,
            IParticipantsBusinessService participantsBusiness,
            IContestCategoriesCacheService contestCategoriesCache,
            IContestValidationService contestValidationService)
        {
            this.contestsData = contestsData;
            this.examGroupsData = examGroupsData;
            this.participantsData = participantsData;
            this.participantScoresData = participantScoresData;
            this.usersBusinessService = usersBusinessService;
            this.userProviderService = userProviderService;
            this.participantsBusiness = participantsBusiness;
            this.contestCategoriesCache = contestCategoriesCache;
            this.contestValidationService = contestValidationService;
        }

        public async Task<RegisterUserForContestServiceModel> RegisterUserForContest(int id, bool official)
        {
            var user = this.userProviderService.GetCurrentUser();
            var userProfile = await this.usersBusinessService.GetUserProfileById(user.Id);

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    id,
                    userProfile.Id,
                    official);

            var contest = await this.contestsData.OneById(id);

            await this.ValidateContest(contest, user.Id, user.IsAdmin, official);

            var registerModel = contest.Map<RegisterUserForContestServiceModel>();
            registerModel.RequirePassword = this.ShouldRequirePassword(contest, participant, official);

            return registerModel;
        }

        private bool ShouldRequirePassword(Contest contest, Participant participant, bool official)
        {
            if (participant != null && !participant.IsInvalidated)
            {
                return false;
            }

            return (official && contest.HasContestPassword) || (!official && contest.HasPracticePassword);
        }

        public async Task ValidateContestPassword(int id, bool official, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new BusinessServiceException("Password is empty");
            }

            var contest = await this.contestsData.OneById(id);

            var isOfficialAndIsCompetePasswordCorrect =
                official && contest.HasContestPassword && contest.ContestPassword == password;

            var isPracticeAndIsPracticePasswordCorrect =
                !official && contest.HasPracticePassword && contest.PracticePassword == password;

            if (!isOfficialAndIsCompetePasswordCorrect && !isPracticeAndIsPracticePasswordCorrect)
            {
                throw new BusinessServiceException("Incorrect password!");
            }
        }

        public async Task<ContestParticipationServiceModel> StartContestParticipation(
            StartContestParticipationServiceModel model)
        {
            var contest = await this.contestsData
                .GetByIdWithProblemsAndSubmissionTypes(model.ContestId);

            var user = this.userProviderService.GetCurrentUser();

            var validationResult = await this.contestValidationService.GetValidationResult((contest, user.Id, user.IsAdmin, model.IsOfficial));

            var userProfile = await this.usersBusinessService.GetUserProfileById(user.Id);

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    model.ContestId,
                    userProfile.Id,
                    model.IsOfficial);

            if (participant == null)
            {
                participant = await this.AddNewParticipantToContestIfNotExists(contest, model.IsOfficial, user.Id, user.IsAdmin);
            }

            if (participant == null)
            {
                participant = new Participant() { Contest = contest, };
            }

            var participationModel = participant.Map<ContestParticipationServiceModel>();

            participationModel.ValidationResult = validationResult;
            participationModel.ContestIsCompete = model.IsOfficial;

            var participantsList = new List<int> { participant.Id, };

            var maxParticipationScores = await this.participantScoresData
                .GetMaxByProblemIdsAndParticipation(
                    participationModel.Contest.Problems.Select(x => x.Id),
                    participantsList
                );

            await participationModel.Contest.Problems.ForEachAsync(problem =>
            {
                problem.Points = maxParticipationScores
                    .Where(ps => ps.ProblemId == problem.Id)
                    .Select(x => x.Points)
                    .FirstOrDefault();
            });

            return participationModel;
        }

        public Task<bool> IsContestIpValidByContestAndIp(int contestId, string ip)
            => this.contestsData
                .Exists(c =>
                    c.Id == contestId &&
                    (!c.IpsInContests.Any() || c.IpsInContests.Any(ai => ai.Ip.Value == ip)));

        private async Task<Participant?> AddNewParticipantToContestIfNotExists(Contest contest, bool official, string userId,
            bool isUserAdmin)
        {
            if (contest.IsOnline &&
                official &&
                !isUserAdmin &&
                !this.IsUserLecturerInContest(contest, userId) &&
                !await this.contestsData.IsUserInExamGroupByContestAndUser(contest.Id, userId))
            {
                return null;
            }

            return await this.participantsBusiness.CreateNewByContestByUserByIsOfficialAndIsAdmin(
                contest,
                userId,
                official,
                isUserAdmin);
        }

        public async Task ValidateContest(Contest contest, string userId, bool isUserAdmin, bool official)
        {
            var isUserLecturerInContest = this.IsUserLecturerInContest(contest, userId);

            if (contest == null ||
                contest.IsDeleted ||
                (!contest.IsVisible && !isUserLecturerInContest))
            {
                throw new BusinessServiceException("Contest not found");
            }

            if (official &&
                !await this.CanUserCompeteByContestByUserAndIsAdmin(
                    contest,
                    userId,
                    isUserAdmin,
                    allowToAdminAlways: true))
            {
                throw new BusinessServiceException($"Contest cannot be competed");
            }

            if (!official && !contest.CanBePracticed && !isUserLecturerInContest)
            {
                throw new BusinessServiceException($"Contest cannot be practiced");
            }
        }

        public async Task<PagedResult<ContestForListingServiceModel>> GetAllByFiltersAndSorting(
            ContestFiltersServiceModel? model)
        {
            model ??= new ContestFiltersServiceModel();
            model.PageNumber ??= 1;
            model.ItemsPerPage ??= DefaultContestsPerPage;

            if (model.CategoryIds.Count() == 1)
            {
                var subcategories = await this.contestCategoriesCache
                    .GetContestSubCategoriesList(model.CategoryIds.First(), CacheConstants.OneHourInSeconds);

                model.CategoryIds = model.CategoryIds
                    .Concat(subcategories.Select(cc => cc.Id).ToList());
            }

            return await this.contestsData.GetAllAsPageByFiltersAndSorting<ContestForListingServiceModel>(model);
        }

        private bool IsUserLecturerInContest(Contest contest, string userId) =>
            contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
            contest.Category.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);

        public async Task<ContestsForHomeIndexServiceModel> GetAllForHomeIndex()
        {
            var active = await this.GetAllCompetable()
                .ToListAsync();
            var past = await this.GetAllPracticable()
                .ToListAsync();

            return new ContestsForHomeIndexServiceModel { ActiveContests = active, PastContests = past, };
        }

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable()
            => await this.contestsData
                .GetAllCompetable<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(ac => ac.EndTime)
                .TakeAsync(DefaultContestsToTake);

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPracticable()
            => await this.contestsData
                .GetAllPracticable<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(ac => ac.PracticeStartTime)
                .TakeAsync(DefaultContestsToTake);

        public async Task<bool> CanUserCompeteByContestByUserAndIsAdmin(
            Contest contest,
            string userId,
            bool isAdmin,
            bool allowToAdminAlways = false)
        {
            var isUserAdminOrLecturerInContest = isAdmin || await this.contestsData
                .IsUserLecturerInByContestAndUser(contest.Id, userId);

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
            var contest = await this.contestsData.GetByIdWithParticipants(contestId);

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
                if (participant == null)
                {
                    continue;
                }

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