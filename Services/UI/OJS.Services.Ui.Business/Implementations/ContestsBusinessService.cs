namespace OJS.Services.Ui.Business.Implementations
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using OJS.Common;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Contests;
    using OJS.Services.Infrastructure.Constants;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Services.Ui.Business.Cache;
    using OJS.Services.Ui.Business.Validations.Implementations.Contests;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Contests;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.Common.Models;
    using X.PagedList;

    public class ContestsBusinessService : IContestsBusinessService
    {
        private const int DefaultContestsToTake = 4;
        private const int DefaultContestsPerPage = 12;

        private readonly IContestsDataService contestsData;
        private readonly IContestsActivityService activityService;
        private readonly IExamGroupsDataService examGroupsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IParticipantsBusinessService participantsBusiness;
        private readonly IContestCategoriesCacheService contestCategoriesCache;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IUsersBusinessService usersBusinessService;
        private readonly IUserProviderService userProviderService;
        private readonly IContestValidationService contestValidationService;
        private readonly IContestParticipantsCacheService contestParticipantsCacheService;
        private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;

        public ContestsBusinessService(
            IContestsDataService contestsData,
            IContestsActivityService activityService,
            IExamGroupsDataService examGroupsData,
            IParticipantsDataService participantsData,
            IParticipantScoresDataService participantScoresData,
            IUsersBusinessService usersBusinessService,
            IUserProviderService userProviderService,
            IParticipantsBusinessService participantsBusiness,
            IContestCategoriesCacheService contestCategoriesCache,
            IContestValidationService contestValidationService,
            IContestParticipantsCacheService contestParticipantsCacheService,
            ILecturersInContestsBusinessService lecturersInContestsBusiness)
        {
            this.contestsData = contestsData;
            this.activityService = activityService;
            this.examGroupsData = examGroupsData;
            this.participantsData = participantsData;
            this.participantScoresData = participantScoresData;
            this.usersBusinessService = usersBusinessService;
            this.userProviderService = userProviderService;
            this.participantsBusiness = participantsBusiness;
            this.contestCategoriesCache = contestCategoriesCache;
            this.contestValidationService = contestValidationService;
            this.contestParticipantsCacheService = contestParticipantsCacheService;
            this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        }

        public async Task<ContestDetailsServiceModel> GetContestDetails(int id)
        {
            var user = this.userProviderService.GetCurrentUser();
            var contest = await this.contestsData.GetByIdWithProblems(id);

            var contestActivityEntity = contest != null
                ? await this.activityService
                .GetContestActivity(contest!.Map<ContestForActivityServiceModel>())
                : new ContestActivityServiceModel();

            var validationResult = this.contestValidationService.GetValidationResult((
                contest,
                id,
                user,
                contestActivityEntity.CanBeCompeted) !);

            if (!validationResult.IsValid)
            {
                throw new BusinessServiceException(validationResult.Message);
            }

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    id,
                    user.Id,
                    contestActivityEntity.CanBeCompeted);

            var userIsAdminOrLecturerInContest = this.lecturersInContestsBusiness.IsUserAdminOrLecturerInContest(contest!);

            var contestDetailsServiceModel = contest!.Map<ContestDetailsServiceModel>();

            // set CanBeCompeted and CanBePracticed properties in contest
            this.activityService.SetCanBeCompetedAndPracticed(contestDetailsServiceModel);

            contestDetailsServiceModel.IsAdminOrLecturerInContest = userIsAdminOrLecturerInContest;

            if (!userIsAdminOrLecturerInContest && participant != null && contestActivityEntity.CanBeCompeted)
            {
                var problemsForParticipant = participant.ProblemsForParticipants.Select(x => x.Problem);
                contestDetailsServiceModel.Problems = problemsForParticipant.Map<ICollection<ContestProblemServiceModel>>();
            }

            var canShowProblemsInPractice = !contest!.HasPracticePassword || userIsAdminOrLecturerInContest;
            var canShowProblemsInCompete = (!contest.HasContestPassword && !contestActivityEntity.IsActive && !contest.IsOnlineExam) || userIsAdminOrLecturerInContest;

            if ((contestActivityEntity.CanBePracticed && !canShowProblemsInPractice) || (contestActivityEntity.CanBeCompeted && !canShowProblemsInCompete))
            {
                contestDetailsServiceModel.Problems = new List<ContestProblemServiceModel>();
            }

            if (userIsAdminOrLecturerInContest || (contestActivityEntity.IsActive && participant != null && contestActivityEntity.CanBeCompeted))
            {
                contestDetailsServiceModel.CanViewResults = true;
            }

            contestDetailsServiceModel.AllowedSubmissionTypes = contest.ProblemGroups
                .SelectMany(pg => pg.Problems)
                .AsQueryable()
                .SelectMany(p => p.SubmissionTypesInProblems)
                .GroupBy(st => st.SubmissionTypeId)
                .Select(g => g.First())
                .Select(x => new ContestDetailsSubmissionTypeServiceModel { Id = x.SubmissionTypeId, Name = x.SubmissionType.Name })
                .ToList();

            var competeContestParticipantsCount = await this.contestParticipantsCacheService.GetCompeteContestParticipantsCount(id);
            var practiceContestParticipantsCount = await this.contestParticipantsCacheService.GetPracticeContestParticipantsCount(id);

            contestDetailsServiceModel.ParticipantsCountByContestType = contestActivityEntity.CanBeCompeted ? competeContestParticipantsCount : practiceContestParticipantsCount;
            contestDetailsServiceModel.TotalContestParticipantsCount = competeContestParticipantsCount + practiceContestParticipantsCount;

            return contestDetailsServiceModel;
        }

        public async Task<RegisterUserForContestServiceModel> RegisterUserForContest(int id, bool official)
        {
            var user = this.userProviderService.GetCurrentUser();
            var userProfile = await this.usersBusinessService.GetUserProfileById(user.Id);

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    id,
                    userProfile!.Id,
                    official);

            var contest = await this.contestsData.OneById(id);

            var validationResult = this.contestValidationService.GetValidationResult((
                contest,
                id,
                user,
                official) !);

            if (!validationResult.IsValid)
            {
                throw new BusinessServiceException(validationResult.Message);
            }

            var registerModel = contest!.Map<RegisterUserForContestServiceModel>();

            registerModel.RequirePassword = ShouldRequirePassword(contest!, participant!, official);
            registerModel.ParticipantId = participant?.Id;

            return registerModel;
        }

        public async Task<ContestServiceModel> GetContestByProblem(int problemId)
        {
           var contestServiceModel = await this.contestsData.GetByProblemId<ContestServiceModel>(problemId);
           if (contestServiceModel == null)
           {
               throw new BusinessServiceException(GlobalConstants.ErrorMessages.ContestNotFound);
           }

           contestServiceModel.AllowedSubmissionTypes = contestServiceModel.AllowedSubmissionTypes.DistinctBy(st => st.Id);

           return contestServiceModel;
        }

        public async Task ValidateContestPassword(int id, bool official, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new BusinessServiceException("Password is empty");
            }

            var contest = await this.contestsData.OneById(id);

            var isOfficialAndIsCompetePasswordCorrect =
                official && contest!.HasContestPassword && contest.ContestPassword == password;

            var isPracticeAndIsPracticePasswordCorrect =
                !official && contest!.HasPracticePassword && contest.PracticePassword == password;

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

            var validationResult = this.contestValidationService.GetValidationResult((
                contest,
                model.ContestId,
                user,
                model.IsOfficial) !);

            if (!validationResult.IsValid)
            {
                throw new BusinessServiceException(validationResult.Message);
            }

            var userProfile = await this.usersBusinessService.GetUserProfileById(user.Id!);

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    model.ContestId,
                    userProfile!.Id,
                    model.IsOfficial);

            if (participant == null)
            {
                participant = await this.AddNewParticipantToContestIfNotExists(contest!, model.IsOfficial, user.Id, user.IsAdmin);
            }

            var participationModel = participant!.Map<ContestParticipationServiceModel>();

            participationModel.Contest.AllowedSubmissionTypes =
                participationModel.Contest.AllowedSubmissionTypes.DistinctBy(st => st.Id);
            participationModel.ParticipantId = participant!.Id;
            participationModel.ContestIsCompete = model.IsOfficial;
            participationModel.UserSubmissionsTimeLimit = await this.participantsBusiness.GetParticipantLimitBetweenSubmissions(
                    participant.Id,
                    contest!.LimitBetweenSubmissions);

            var participantsList = new List<int> { participant.Id, };

            var maxParticipationScores = await this.participantScoresData
                .GetMaxByProblemIdsAndParticipation(
                    participationModel.Contest.Problems.Select(x => x.Id),
                    participantsList);

            var userIsAdminOrLecturerInContest = this.lecturersInContestsBusiness.IsUserAdminOrLecturerInContest(contest);
            var isOfficialOnlineContest = participationModel.ContestIsCompete && contest.IsOnlineExam;

            if (!userIsAdminOrLecturerInContest && isOfficialOnlineContest)
            {
                var problemsForParticipant = participant.ProblemsForParticipants.Select(x => x.Problem);
                participationModel.Contest.Problems = problemsForParticipant.MapCollection<ContestProblemServiceModel>().ToList();
            }

            await participationModel.Contest.Problems.ForEachAsync(problem =>
            {
                problem.Points = maxParticipationScores
                    .Where(ps => ps.ProblemId == problem.Id)
                    .Select(x => x.Points)
                    .FirstOrDefault();
            });

            if (model.IsOfficial)
            {
                participationModel.ParticipantsCount = await this.contestParticipantsCacheService.GetCompeteContestParticipantsCount(model.ContestId);
            }
            else
            {
                participationModel.ParticipantsCount = await this.contestParticipantsCacheService.GetPracticeContestParticipantsCount(model.ContestId);
            }

            return participationModel;
        }

        public async Task<ContestSearchServiceResultModel> GetSearchContestsByName(
            SearchServiceModel model)
        {
            var modelResult = new ContestSearchServiceResultModel();

            var allContestsQueryable = this.contestsData.GetAllNonDeletedContests()
                .Where(c => c.Name!.Contains(model.SearchTerm!));

            var searchContests = allContestsQueryable.MapCollection<ContestSearchServiceModel>();

            //set CanBeCompeted and CanBePracticed properties in each contest from the result
            searchContests.ForEach(c => this.activityService.SetCanBeCompetedAndPracticed(c));
            var pagedResult = await searchContests.ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

            modelResult.Contests = pagedResult;
            modelResult.TotalContestsCount = allContestsQueryable.Count();

            return modelResult;
        }

        public Task<bool> IsContestIpValidByContestAndIp(int contestId, string ip)
            => this.contestsData
                .Exists(c =>
                    c.Id == contestId &&
                    (!c.IpsInContests.Any() || c.IpsInContests.Any(ai => ai.Ip.Value == ip)));

        public async Task ValidateContest(Contest contest, string userId, bool isUserAdmin, bool official)
        {
            var isUserLecturerInContest = this.lecturersInContestsBusiness.IsUserLecturerInContest(contest);

            if (contest == null ||
                contest.IsDeleted ||
                (!contest.IsVisible && !isUserLecturerInContest))
            {
                throw new BusinessServiceException("Contest not found");
            }

            var contestActivityEntity = await this.activityService
                .GetContestActivity(contest.Map<ContestForActivityServiceModel>());

            if (official &&
                !await this.CanUserCompeteByContestByUserAndIsAdmin(
                    contestActivityEntity,
                    userId,
                    isUserAdmin))
            {
                throw new BusinessServiceException($"Contest cannot be competed");
            }

            if (!official && !contestActivityEntity.CanBePracticed && !isUserLecturerInContest)
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

            var pagedContests =
                await this.contestsData.GetAllAsPageByFiltersAndSorting<ContestForListingServiceModel>(model);

            //set CanBeCompeted and CanBePracticed properties in each contest for the page
            pagedContests.Items.ForEach(c => this.activityService.SetCanBeCompetedAndPracticed(c));

            return pagedContests;
        }

        public async Task<ContestsForHomeIndexServiceModel> GetAllForHomeIndex()
        {
            var active = await this.GetAllCompetable()
                .ToListAsync();
            //set CanBeCompeted and CanBePracticed properties in each active contest
            active.ForEach(c => this.activityService.SetCanBeCompetedAndPracticed(c));

            var past = await this.GetAllPastContests()
                .ToListAsync();
            //set CanBeCompeted and CanBePracticed properties in each active contest
            past.ForEach(c => this.activityService.SetCanBeCompetedAndPracticed(c));

            return new ContestsForHomeIndexServiceModel { ActiveContests = active, PastContests = past, };
        }

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable()
            => await this.contestsData
                .GetAllCompetable<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(ac => ac.EndTime)
                .TakeAsync(DefaultContestsToTake);

        public async Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPastContests()
            => await this.contestsData
                .GetAllExpired<ContestForHomeIndexServiceModel>()
                .OrderByDescendingAsync(ac => ac.EndTime)
                .TakeAsync(DefaultContestsToTake);

        public async Task<bool> CanUserCompeteByContestByUserAndIsAdmin(
            IContestActivityServiceModel contest,
            string userId,
            bool isAdmin)
        {
            var isUserAdminOrLecturerInContest = isAdmin || await this.contestsData
                .IsUserLecturerInByContestAndUser(contest.Id, userId);

            if (contest.CanBeCompeted || isUserAdminOrLecturerInContest || contest.IsActive)
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

            var contestActivity = await this.activityService.GetContestActivity(contest.Id);

            if (contestActivity.IsActive)
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

        private static bool ShouldRequirePassword(Contest contest, Participant participant, bool official)
        {
            if (participant != null && !participant.IsInvalidated)
            {
                return false;
            }

            return (official && contest.HasContestPassword) || (!official && contest.HasPracticePassword);
        }

        private async Task<Participant?> AddNewParticipantToContestIfNotExists(
            Contest contest,
            bool official,
            string userId,
            bool isUserAdmin)
        {
            if (contest.IsOnlineExam &&
                official &&
                !isUserAdmin &&
                !this.lecturersInContestsBusiness.IsUserLecturerInContest(contest) &&
                !await this.contestsData.IsUserInExamGroupByContestAndUser(contest.Id, userId))
            {
                throw new BusinessServiceException(ValidationMessages.Participant.NotRegisteredForExam);
            }

            return await this.participantsBusiness.CreateNewByContestByUserByIsOfficialAndIsAdmin(
                contest,
                userId,
                official,
                isUserAdmin);
        }

        private async Task<Participant> AddNewParticipantToContest(
            Contest contest,
            bool official,
            string userId,
            bool isUserAdmin)
        {
            if (contest.IsExam &&
                official &&
                !isUserAdmin &&
                !this.lecturersInContestsBusiness.IsUserLecturerInContest(contest) &&
                !await this.contestsData.IsUserInExamGroupByContestAndUser(contest.Id, userId))
            {
                throw new BusinessServiceException("You are not registered for this exam!");
            }

            return await this.participantsBusiness.CreateNewByContestByUserByIsOfficialAndIsAdmin(
                contest,
                userId,
                official,
                isUserAdmin);
        }
    }
}