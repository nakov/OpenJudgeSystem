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
        private readonly IContestDetailsValidationService contestDetailsValidationService;

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
            ILecturersInContestsBusinessService lecturersInContestsBusiness,
            IContestDetailsValidationService contestDetailsValidationService)
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
            this.contestDetailsValidationService = contestDetailsValidationService;
        }

        public async Task<ContestDetailsServiceModel> GetContestDetails(int id)
        {
            var user = this.userProviderService.GetCurrentUser();
            var contest = await this.contestsData.GetByIdWithProblems(id);
            var isLecturerOrAdmin = contest != null && this.lecturersInContestsBusiness.IsUserAdminOrLecturerInContest(contest);

            var validationResult = this.contestDetailsValidationService.GetValidationResult((
                contest,
                id,
                isLecturerOrAdmin));
            if (!validationResult.IsValid)
            {
                throw new BusinessServiceException(validationResult.Message);
            }

            var contestActivityEntity = this.activityService
                .GetContestActivity(contest!.Map<ContestForActivityServiceModel>());

            var participant = await this.participantsData
                .GetWithContestByContestByUserAndIsOfficial(
                    id,
                    user.Id,
                    contestActivityEntity.CanBeCompeted);

            var contestDetailsServiceModel = contest!.Map<ContestDetailsServiceModel>();

            // set CanBeCompeted and CanBePracticed properties in contest
            this.activityService.SetCanBeCompetedAndPracticed(contestDetailsServiceModel);

            contestDetailsServiceModel.IsAdminOrLecturerInContest = isLecturerOrAdmin;

            if (!isLecturerOrAdmin && participant != null && contestActivityEntity.CanBeCompeted)
            {
                var problemsForParticipant = participant.ProblemsForParticipants.Select(x => x.Problem);
                contestDetailsServiceModel.Problems = problemsForParticipant.Map<ICollection<ContestProblemServiceModel>>();
            }

            var canShowProblemsInCompete = (!contest!.HasContestPassword && !contest.IsOnlineExam && contestActivityEntity.CanBeCompeted) || isLecturerOrAdmin;
            var canShowProblemsInPractice = (!contest.HasPracticePassword && contestActivityEntity.CanBePracticed) || isLecturerOrAdmin;
            var canShowProblemsForAnonymous = user.Id != null || !contestActivityEntity.CanBeCompeted;

            if ((!canShowProblemsInPractice && !canShowProblemsInCompete) || !canShowProblemsForAnonymous)
            {
                contestDetailsServiceModel.Problems = new List<ContestProblemServiceModel>();
            }

            if (isLecturerOrAdmin || participant != null)
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

            contestDetailsServiceModel.CompeteParticipantsCount = await this.contestParticipantsCacheService.GetCompeteContestParticipantsCount(id);
            contestDetailsServiceModel.PracticeParticipantsCount = await this.contestParticipantsCacheService.GetPracticeContestParticipantsCount(id);

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
            participationModel.Contest.UserIsAdminOrLecturerInContest = userIsAdminOrLecturerInContest;

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
                .Where(c => (c.Name != null && c.Name.Contains(model.SearchTerm ?? string.Empty)) &&
                            (c.Category != null && c.Category.IsVisible));

            var searchContests = await allContestsQueryable
                .MapCollection<ContestSearchServiceModel>()
                .ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

            modelResult.Contests = searchContests;
            modelResult.TotalContestsCount = allContestsQueryable.Count();

            return modelResult;
        }

        public Task<bool> IsContestIpValidByContestAndIp(int contestId, string ip)
            => this.contestsData
                .Exists(c =>
                    c.Id == contestId &&
                    (!c.IpsInContests.Any() || c.IpsInContests.Any(ai => ai.Ip.Value == ip)));

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